import { NextRequest, NextResponse } from "next/server";
import { PLANS, getPlanPricing } from "@/lib/plans";
import { getRazorpayClient, RAZORPAY_KEY_ID } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, billingCycle, email, paymentMethod = "upi_qr", currency: requestedCurrency } = body;

    // 1. Validate email
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required for subscription receipt and account entitlement." },
        { status: 400 }
      );
    }

    // 2. Validate planId (only paid plans can create an order)
    if (!planId || (planId !== "pro" && planId !== "agency")) {
      return NextResponse.json(
        { error: "Invalid plan identifier. Only 'pro' and 'agency' require checkout orders." },
        { status: 400 }
      );
    }

    // 3. Validate billingCycle
    if (billingCycle !== "monthly" && billingCycle !== "annual") {
      return NextResponse.json(
        { error: "Invalid billing cycle. Must be 'monthly' or 'annual'." },
        { status: 400 }
      );
    }

    // 4. Determine Currency based on payment method and NPCI regulations
    // UPI QR strictly requires INR. Card payments support USD or INR.
    let currency: "USD" | "INR" = "USD";
    if (paymentMethod === "upi_qr" || requestedCurrency === "INR") {
      currency = "INR";
    } else if (requestedCurrency === "USD" || paymentMethod === "card") {
      currency = requestedCurrency === "INR" ? "INR" : "USD";
    }

    // 5. Lookup TRUSTED server-side price (Never trust client-submitted amount)
    const pricing = getPlanPricing(planId, billingCycle, currency);
    if (!pricing || pricing.amount <= 0) {
      return NextResponse.json(
        { error: "Selected plan does not require a payment transaction or pricing is invalid." },
        { status: 400 }
      );
    }

    const planConfig = PLANS[planId];
    const sanitizedEmail = email.trim().toLowerCase();
    const receipt = `rcpt_${planId}_${Date.now().toString().slice(-8)}`;

    // 6. Real Razorpay Order Creation if keys are configured
    const razorpay = getRazorpayClient();

    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: pricing.amount,
        currency,
        receipt,
        notes: {
          planId,
          planName: planConfig.name,
          billingCycle,
          customerEmail: sanitizedEmail,
          paymentMethod,
          currency,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planId,
        planName: planConfig.name,
        billingCycle,
        displayPrice: pricing.displayPrice,
        paymentMethod,
        keyId: RAZORPAY_KEY_ID,
        isSandbox: false,
      });
    }

    // 7. Razorpay Sandbox Simulator Mode (fallback when keys are pending)
    const sandboxOrderId = `order_sandbox_${planId}_${Date.now()}`;

    return NextResponse.json({
      orderId: sandboxOrderId,
      amount: pricing.amount,
      currency,
      planId,
      planName: planConfig.name,
      billingCycle,
      displayPrice: pricing.displayPrice,
      paymentMethod,
      keyId: "rzp_test_placeholder",
      isSandbox: true,
      notice: "Sandbox preview only; no payment is processed. Configure valid Razorpay credentials before enabling paid checkout.",
    });
  } catch (error: unknown) {
    console.error("Razorpay order creation error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create payment order.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
