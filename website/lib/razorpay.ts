import crypto from "crypto";
import Razorpay from "razorpay";

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";
export const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

export const isRazorpayConfigured = Boolean(
  RAZORPAY_KEY_ID &&
  RAZORPAY_KEY_SECRET &&
  !RAZORPAY_KEY_ID.includes("placeholder") &&
  !RAZORPAY_KEY_SECRET.includes("placeholder")
);

// Idempotent processed events registry
const processedEvents = new Set<string>();

/**
 * Returns a configured Razorpay instance or null if in sandbox mode
 */
export function getRazorpayClient(): Razorpay | null {
  if (!isRazorpayConfigured) return null;
  return new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
  });
}

/**
 * Verifies Razorpay Payment Signature for Standard Checkout:
 * HMAC_SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!RAZORPAY_KEY_SECRET) {
    // If in test sandbox simulator mode, allow test order matching
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const actual = Buffer.from(signature, "hex");
  const expected = Buffer.from(generatedSignature, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/**
 * Verifies Razorpay Webhook Signature using raw request body:
 * HMAC_SHA256(rawBody, webhook_secret) == signature
 */
export function verifyWebhookSignature({
  rawBody,
  signature,
}: {
  rawBody: string;
  signature: string | null;
}): boolean {
  if (!signature || !RAZORPAY_WEBHOOK_SECRET) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  const actual = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

/**
 * Checks if a webhook or order event has already been processed (Idempotency)
 */
export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

/**
 * Marks an event as processed
 */
export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId);
  // Keep set size reasonable in long-running processes
  if (processedEvents.size > 10000) {
    const iterator = processedEvents.values();
    for (let i = 0; i < 1000; i++) {
      const item = iterator.next().value;
      if (item) processedEvents.delete(item);
    }
  }
}
