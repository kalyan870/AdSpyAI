import crypto from "crypto";

export interface PlanPricing {
  amount: number; // in subunits: cents for USD (e.g. 4900 = $49.00), paise for INR (e.g. 399900 = ₹3,999.00)
  displayPrice: string;
  currency: string;
  interval: "month" | "year";
  periodLabel: string;
}

export interface PlanLimits {
  analysesPerDay: number; // -1 for unlimited
  hasAlternativeHooks: boolean;
  hasAlternativeScripts: boolean;
  hasWhiteLabelExport: boolean;
  teamSeats: number;
  priorityQueue: boolean;
}

export interface PlanDefinition {
  id: "free" | "pro" | "agency";
  name: string;
  description: string;
  usd: {
    monthly: PlanPricing;
    annual: PlanPricing;
  };
  inr: {
    monthly: PlanPricing;
    annual: PlanPricing;
  };
  features: string[];
  limits: PlanLimits;
}

/**
 * TRUSTED SERVER-SIDE PRICING & PLAN DEFINITIONS
 * 
 * Never trust amount or plan parameters submitted by the client browser.
 * These definitions represent the canonical source of truth for Razorpay orders.
 * UPI QR requires INR under NPCI/Razorpay regulations; Cards support USD & INR.
 */
export const PLANS: Record<string, PlanDefinition> = {
  free: {
    id: "free",
    name: "Free Beta",
    description: "Ideal for testing viral ad links and hook teardowns",
    usd: {
      monthly: {
        amount: 0,
        displayPrice: "$0",
        currency: "USD",
        interval: "month",
        periodLabel: "forever",
      },
      annual: {
        amount: 0,
        displayPrice: "$0",
        currency: "USD",
        interval: "year",
        periodLabel: "forever",
      },
    },
    inr: {
      monthly: {
        amount: 0,
        displayPrice: "₹0",
        currency: "INR",
        interval: "month",
        periodLabel: "forever",
      },
      annual: {
        amount: 0,
        displayPrice: "₹0",
        currency: "INR",
        interval: "year",
        periodLabel: "forever",
      },
    },
    features: [
      "5 ad analyses per day",
      "Hook retention diagnostic (0-100)",
      "Timeline script breakdown",
      "5 Sora 2 video generation prompts",
      "Full UGC script reconstruction",
      "JSON export of analysis reports",
    ],
    limits: {
      analysesPerDay: 5,
      hasAlternativeHooks: false,
      hasAlternativeScripts: false,
      hasWhiteLabelExport: false,
      teamSeats: 1,
      priorityQueue: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro Creator",
    description: "For active UGC creators, editors, and growth marketers",
    usd: {
      monthly: {
        amount: 4900, // $49.00 USD
        displayPrice: "$49",
        currency: "USD",
        interval: "month",
        periodLabel: "/month",
      },
      annual: {
        amount: 46800, // $39.00/mo * 12 = $468.00 USD (20% discount)
        displayPrice: "$39",
        currency: "USD",
        interval: "year",
        periodLabel: "/month, billed annually",
      },
    },
    inr: {
      monthly: {
        amount: 399900, // ₹3,999.00 INR (paise)
        displayPrice: "₹3,999",
        currency: "INR",
        interval: "month",
        periodLabel: "/month",
      },
      annual: {
        amount: 3838800, // ₹3,199/mo * 12 = ₹38,388.00 INR (20% discount)
        displayPrice: "₹3,199",
        currency: "INR",
        interval: "year",
        periodLabel: "/month, billed annually",
      },
    },
    features: [
      "Unlimited viral ad analyses",
      "High-velocity batch processing",
      "Advanced psychological trigger diagnosis",
      "All 5 Sora 2 shot-by-shot prompts",
      "Multi-angle script variants (3 hooks per ad)",
      "Priority API queue",
      "Early access to Sora 2 rendering pipeline",
    ],
    limits: {
      analysesPerDay: -1, // unlimited
      hasAlternativeHooks: true,
      hasAlternativeScripts: true,
      hasWhiteLabelExport: false,
      teamSeats: 1,
      priorityQueue: true,
    },
  },
  agency: {
    id: "agency",
    name: "Agency & Studio",
    description: "For agencies and media-buying teams scaling creative",
    usd: {
      monthly: {
        amount: 14900, // $149.00 USD
        displayPrice: "$149",
        currency: "USD",
        interval: "month",
        periodLabel: "/month",
      },
      annual: {
        amount: 142800, // $119.00/mo * 12 = $1,428.00 USD (20% discount)
        displayPrice: "$119",
        currency: "USD",
        interval: "year",
        periodLabel: "/month, billed annually",
      },
    },
    inr: {
      monthly: {
        amount: 1199900, // ₹11,999.00 INR (paise)
        displayPrice: "₹11,999",
        currency: "INR",
        interval: "month",
        periodLabel: "/month",
      },
      annual: {
        amount: 11518800, // ₹9,599/mo * 12 = ₹115,188.00 INR (20% discount)
        displayPrice: "₹9,599",
        currency: "INR",
        interval: "year",
        periodLabel: "/month, billed annually",
      },
    },
    features: [
      "Everything in Pro Creator",
      "5 team collaborator seats",
      "White-label client export reports",
      "Custom brand voice tone calibration",
      "Dedicated account strategist support",
      "Webhook and REST API integration access",
    ],
    limits: {
      analysesPerDay: -1, // unlimited
      hasAlternativeHooks: true,
      hasAlternativeScripts: true,
      hasWhiteLabelExport: true,
      teamSeats: 5,
      priorityQueue: true,
    },
  },
};

/**
 * Resolves trusted pricing for a plan given billing cycle and currency
 */
export function getPlanPricing(
  planId: string,
  billingCycle: "monthly" | "annual",
  currency: "USD" | "INR" = "USD"
): PlanPricing | null {
  const plan = PLANS[planId];
  if (!plan) return null;
  const currencyGroup = currency === "INR" ? plan.inr : plan.usd;
  return currencyGroup[billingCycle] || null;
}

export interface EntitlementPayload {
  planId: "pro" | "agency";
  planName: string;
  billingCycle: "monthly" | "annual";
  email: string;
  orderId: string;
  paymentId: string;
  amountPaid: number;
  currency: string;
  paymentMethod?: "card" | "upi_qr" | "upi" | "netbanking" | "other";
  issuedAt: number;
  expiresAt: number;
  limits: PlanLimits;
}

const SIGNING_SECRET = process.env.RAZORPAY_KEY_SECRET || process.env.ENTITLEMENT_SECRET;

/**
 * Creates a cryptographically signed entitlement token for paid users.
 */
export function createEntitlementToken(payload: EntitlementPayload): string {
  if (!SIGNING_SECRET) {
    throw new Error("Entitlement signing is not configured.");
  }
  const data = JSON.stringify(payload);
  const base64Data = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SIGNING_SECRET)
    .update(base64Data)
    .digest("base64url");
  return `${base64Data}.${signature}`;
}

/**
 * Verifies and parses an entitlement token.
 */
export function verifyEntitlementToken(token: string): EntitlementPayload | null {
  try {
    if (!SIGNING_SECRET) return null;
    const [base64Data, signature] = token.split(".");
    if (!base64Data || !signature) return null;

    const expectedSignature = crypto
      .createHmac("sha256", SIGNING_SECRET)
      .update(base64Data)
      .digest("base64url");

    const actual = Buffer.from(signature, "base64url");
    const expected = Buffer.from(expectedSignature, "base64url");
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

    const decoded = JSON.parse(Buffer.from(base64Data, "base64url").toString("utf-8"));

    // Check expiration
    if (decoded.expiresAt && Date.now() > decoded.expiresAt) {
      return null;
    }

    return decoded as EntitlementPayload;
  } catch {
    return null;
  }
}
