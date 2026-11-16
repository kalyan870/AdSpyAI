import { NextRequest, NextResponse } from "next/server";
import { PLANS, getPlanPricing, createEntitlementToken } from "@/lib/plans";
import { verifyPaymentSignature, markEventProcessed, getRazorpayClient, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentId, signature, planId, billingCycle, email, currency = "USD", paymentMethod = "card" } = body;

    // Sandbox checkout responses are previews only. They must never mint paid entitlements.
    if (!isRazorpayConfigured) {
      return NextResponse.json(
        { error: "Payment verification is unavailable until Razorpay credentials are configured. Sandbox orders cannot activate paid plans." },
        { status: 503 }
      );
    }

    if (
      typeof orderId !== "string" || !orderId ||
      typeof paymentId !== "string" || !paymentId ||
      typeof signature !== "string" || !signature ||
      typeof planId !== "string" || !planId ||
      typeof email !== "string" || !email.includes("@") ||
      (billingCycle !== "monthly" && billingCycle !== "annual") ||
      (currency !== "USD" && currency !== "INR")
    ) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // 1. Verify HMAC-SHA256 signature
    const isValid = verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      console.error(`Payment verification failed for order: ${orderId}, payment: ${paymentId}`);
      return NextResponse.json(
        { error: "Payment verification failed. Invalid cryptographic signature." },
        { status: 400 }
      );
    }

    // 2. Validate plan
    const planConfig = PLANS[planId];
    if (!planConfig) {
      return NextResponse.json({ error: "Invalid plan identifier." }, { status: 400 });
    }

    // 3. Resolve trusted pricing
    // 4. Confirm the signed payment belongs to the expected server-priced order.
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return NextResponse.json({ error: "Razorpay is not configured." }, { status: 503 });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    const billing = billingCycle as "monthly" | "annual";
    const paymentCurrency = currency as "USD" | "INR";
    const pricing = getPlanPricing(planId, billing, paymentCurrency);
    if (!pricing) {
      return NextResponse.json({ error: "No server-side price is configured for this plan." }, { status: 400 });
    }
    const amountPaid = pricing.amount;

    let order;
    let paymentDetails;
    try {
      [order, paymentDetails] = await Promise.all([
        razorpay.orders.fetch(orderId),
        razorpay.payments.fetch(paymentId),
      ]);
    } catch {
      return NextResponse.json({ error: "Unable to confirm this order with Razorpay." }, { status: 502 });
    }

    const orderNotes = (order.notes as Record<string, string>) || {};
    if (
      order.id !== orderId || paymentDetails.order_id !== orderId ||
      order.amount !== pricing.amount || paymentDetails.amount !== pricing.amount ||
      order.currency !== paymentCurrency || paymentDetails.currency !== paymentCurrency ||
      orderNotes.planId !== planId || orderNotes.billingCycle !== billing ||
      orderNotes.customerEmail !== sanitizedEmail
    ) {
      return NextResponse.json({ error: "Payment details do not match the selected plan and customer." }, { status: 400 });
    }
    if (paymentDetails.status !== "captured" || order.status !== "paid") {
      return NextResponse.json(
        { error: `Payment is not captured. Current status: ${paymentDetails.status}.` },
        { status: 400 }
      );
    }
    const verifiedMethod = paymentDetails.method === "upi" ? "upi_qr" : paymentDetails.method || paymentMethod;

    const now = Date.now();
    const durationDays = billing === "annual" ? 365 : 30;
    const expiresAt = now + durationDays * 24 * 60 * 60 * 1000;

    // 5. Issue cryptographic entitlement token
    const token = createEntitlementToken({
      planId: planId as "pro" | "agency",
      planName: planConfig.name,
      billingCycle: billing,
      email: sanitizedEmail,
      orderId,
      paymentId,
      amountPaid,
      currency: paymentCurrency,
      paymentMethod: verifiedMethod,
      issuedAt: now,
      expiresAt,
      limits: planConfig.limits,
    });

    // 6. Mark event processed for idempotency
    markEventProcessed(`pay_${paymentId}`);
    markEventProcessed(`ord_${orderId}`);

    return NextResponse.json({
      success: true,
      message: `Payment verified. ${planConfig.name} access is now activated!`,
      entitlement: {
        token,
        planId,
        planName: planConfig.name,
        billingCycle: billing,
        email: sanitizedEmail,
        orderId,
        paymentId,
        currency: paymentCurrency,
        paymentMethod: verifiedMethod,
        expiresAt: new Date(expiresAt).toISOString(),
        limits: planConfig.limits,
      },
    });
  } catch (error: unknown) {
    console.error("Verification endpoint error:", error);
    const msg = error instanceof Error ? error.message : "Error verifying payment.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
