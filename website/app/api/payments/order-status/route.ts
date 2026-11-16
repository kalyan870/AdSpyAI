import { NextRequest, NextResponse } from "next/server";
import { PLANS, getPlanPricing, createEntitlementToken } from "@/lib/plans";
import { getRazorpayClient } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const expectedEmail = searchParams.get("email")?.trim().toLowerCase();
    const expectedPlanId = searchParams.get("planId");

    if (!orderId || !expectedEmail || !expectedPlanId) {
      return NextResponse.json({ error: "orderId, email, and planId are required" }, { status: 400 });
    }

    const razorpay = getRazorpayClient();
    if (!razorpay) {
      // In sandbox mode
      return NextResponse.json({
        orderId,
        status: "created",
        paid: false,
        isSandbox: true,
      });
    }

    // Fetch order from Razorpay
    const order = await razorpay.orders.fetch(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      // Fetch associated payments
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payments: any = await razorpay.orders.fetchPayments(orderId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const capturedPayment = payments?.items?.find((p: any) => p.status === "captured");

      if (capturedPayment) {
        const notes = (order.notes as Record<string, string>) || {};
        if (notes.planId !== expectedPlanId || notes.customerEmail !== expectedEmail) {
          return NextResponse.json({ error: "Order does not match the requested plan and customer." }, { status: 403 });
        }
        const planId = notes.planId as "pro" | "agency";
        const billingCycle = notes.billingCycle as "monthly" | "annual";
        const email = notes.customerEmail;
        const currency = (order.currency as "USD" | "INR") || "INR";
        const planConfig = PLANS[planId];

        const pricing = getPlanPricing(planId, billingCycle, currency);
        if (
          !planConfig || !pricing || order.id !== orderId || capturedPayment.order_id !== orderId ||
          order.amount !== pricing.amount || capturedPayment.amount !== pricing.amount ||
          capturedPayment.currency !== currency
        ) {
          return NextResponse.json({ error: "Paid order details did not match the server plan price." }, { status: 400 });
        }
        const amountPaid = pricing.amount;

        const now = Date.now();
        const durationDays = billingCycle === "annual" ? 365 : 30;
        const expiresAt = now + durationDays * 24 * 60 * 60 * 1000;

        const token = createEntitlementToken({
          planId,
          planName: planConfig?.name || "Pro Creator",
          billingCycle,
          email,
          orderId: order.id,
          paymentId: capturedPayment.id,
          amountPaid,
          currency,
          paymentMethod: capturedPayment.method === "upi" ? "upi_qr" : capturedPayment.method,
          issuedAt: now,
          expiresAt,
          limits: planConfig?.limits || {
            analysesPerDay: -1,
            hasAlternativeHooks: true,
            hasAlternativeScripts: true,
            hasWhiteLabelExport: false,
            teamSeats: 1,
            priorityQueue: true,
          },
        });

        return NextResponse.json({
          orderId: order.id,
          status: "paid",
          paid: true,
          paymentId: capturedPayment.id,
          paymentMethod: capturedPayment.method,
          entitlement: {
            token,
            planId,
            planName: planConfig?.name || "Pro Creator",
            billingCycle,
            email,
            orderId: order.id,
            paymentId: capturedPayment.id,
            currency,
            expiresAt: new Date(expiresAt).toISOString(),
          },
        });
      }
    }

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      paid: order.status === "paid",
      amount: order.amount,
      amountDue: order.amount_due,
      currency: order.currency,
    });
  } catch (error: unknown) {
    console.error("Order status check error:", error);
    const msg = error instanceof Error ? error.message : "Error checking order status";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
