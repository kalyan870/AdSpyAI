import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature, isEventProcessed, markEventProcessed } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    // Read raw body string as required for HMAC-SHA256 signature verification
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    // Verify webhook signature
    const isValid = verifyWebhookSignature({
      rawBody,
      signature,
    });

    if (!isValid) {
      console.warn("Razorpay webhook received with invalid signature or missing secret.");
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    let eventPayload: {
      event: string;
      id?: string;
      payload?: {
        payment?: { entity?: { id: string; order_id: string; amount: number; status: string; email: string } };
        order?: { entity?: { id: string; amount: number; status: string; notes?: Record<string, string> } };
      };
    };

    try {
      eventPayload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Malformed webhook JSON payload" }, { status: 400 });
    }

    const eventId = eventPayload.id || `evt_${Date.now()}`;
    const eventType = eventPayload.event;

    // Idempotency check: prevent duplicate event processing
    if (isEventProcessed(eventId)) {
      return NextResponse.json({ status: "already_processed", eventId }, { status: 200 });
    }

    markEventProcessed(eventId);

    // Handle supported Razorpay event types
    switch (eventType) {
      case "order.paid": {
        const orderEntity = eventPayload.payload?.order?.entity;
        const notes = orderEntity?.notes || {};
        console.log(`[Razorpay Webhook: order.paid] Order ${orderEntity?.id} paid for Plan: ${notes.planId}, Customer: ${notes.customerEmail}`);
        break;
      }

      case "payment.captured": {
        const paymentEntity = eventPayload.payload?.payment?.entity;
        console.log(`[Razorpay Webhook: payment.captured] Payment ${paymentEntity?.id} captured for Order ${paymentEntity?.order_id}, Amount: ${paymentEntity?.amount}`);
        break;
      }

      case "payment.failed": {
        const paymentEntity = eventPayload.payload?.payment?.entity;
        console.warn(`[Razorpay Webhook: payment.failed] Payment ${paymentEntity?.id} failed for Order ${paymentEntity?.order_id}`);
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Received unhandled event type: ${eventType}`);
        break;
    }

    return NextResponse.json({ status: "ok", received: true, eventId });
  } catch (error: unknown) {
    console.error("Razorpay webhook processing error:", error);
    const msg = error instanceof Error ? error.message : "Webhook handler failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
