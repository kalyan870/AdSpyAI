"use client";
import { useState, useEffect, useRef } from "react";
import { PricingTier } from "@/types";

const tiers: PricingTier[] = [
  {
    id: "free",
    name: "Free Beta",
    price: "$0",
    period: "forever",
    description: "Ideal for testing viral ad links and hook teardowns",
    features: [
      "5 ad analyses per day",
      "Hook retention diagnostic (0-100)",
      "Timeline script breakdown",
      "5 Sora 2 video generation prompts",
      "Full UGC script reconstruction",
      "JSON export of analysis reports",
    ],
    highlighted: false,
    cta: "Start Free Now",
  },
  {
    id: "pro",
    name: "Pro Creator",
    price: "$49",
    period: "month",
    description: "For active UGC creators, editors, and growth marketers",
    features: [
      "Unlimited viral ad analyses",
      "High-velocity batch processing",
      "Advanced psychological trigger diagnosis",
      "All 5 Sora 2 shot-by-shot prompts",
      "Multi-angle script variants (3 hooks per ad)",
      "Priority API queue",
      "Early access to Sora 2 rendering pipeline",
    ],
    highlighted: true,
    cta: "Subscribe to Pro Creator",
  },
  {
    id: "agency",
    name: "Agency & Studio",
    price: "$149",
    period: "month",
    description: "For agencies and media-buying teams scaling creative",
    features: [
      "Everything in Pro Creator",
      "5 team collaborator seats",
      "White-label client export reports",
      "Custom brand voice tone calibration",
      "Dedicated account strategist support",
      "Webhook and REST API integration access",
    ],
    highlighted: false,
    cta: "Subscribe to Agency Plan",
  },
];

interface ActiveEntitlement {
  planId: string;
  planName: string;
  billingCycle: string;
  email: string;
  orderId: string;
  paymentId: string;
  currency?: string;
  paymentMethod?: string;
  expiresAt: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<PricingTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [currency, setCurrency] = useState<"USD" | "INR">("INR"); // Default to INR to enable UPI QR natively
  const [paymentMethod, setPaymentMethod] = useState<"upi_qr" | "card">("upi_qr");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("9876543210");
  const [loading, setLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [sandboxOrderData, setSandboxOrderData] = useState<{
    orderId: string;
    amount: number;
    currency: string;
    planName: string;
    displayPrice: string;
  } | null>(null);
  const [activeEntitlement, setActiveEntitlement] = useState<ActiveEntitlement | null>(null);

  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check stored entitlement on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("adspy_active_entitlement");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (!parsed.expiresAt || new Date(parsed.expiresAt).getTime() > Date.now())) {
          setActiveEntitlement(parsed);
        }
      }
    } catch {
      // Storage fallback
    }
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  const handleCta = (tier: PricingTier) => {
    if (tier.name === "Free Beta" || tier.id === "free") {
      const elem = document.getElementById("preview");
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
        const input = document.getElementById("ad-url-input");
        if (input) setTimeout(() => input.focus(), 600);
      }
      return;
    }

    setSelectedPlan(tier);
    setErrorMessage("");
    setPendingStatus(null);
    setSandboxOrderData(null);
  };

  // Start background order status polling for QR payments
  const startOrderStatusPolling = (orderId: string, currentEmail: string, currentPlanId: string) => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    let attempts = 0;
    const maxAttempts = 100; // 5 minutes (every 3 seconds)

    pollingTimerRef.current = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
        return;
      }

      try {
        const params = new URLSearchParams({ orderId, email: currentEmail.trim().toLowerCase(), planId: currentPlanId });
        const res = await fetch(`/api/payments/order-status?${params.toString()}`);
        if (!res.ok) return;
        const statusData = await res.json();

        if (statusData.paid && statusData.entitlement) {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          localStorage.setItem("adspy_active_entitlement", JSON.stringify(statusData.entitlement));
          setActiveEntitlement(statusData.entitlement);
          setPendingStatus("Payment Confirmed! Your access is activated.");
          setLoading(false);
          // Auto close checkout modal after confirmation
          setTimeout(() => {
            setSelectedPlan(null);
            setPendingStatus(null);
          }, 1500);
        }
      } catch {
        // Continue polling silently
      }
    }, 3000);
  };

  const handleInitiateCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !email || !email.includes("@")) {
      setErrorMessage("Please enter a valid work or creator email address.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setPendingStatus(null);

    const planId = selectedPlan.id || (selectedPlan.name.includes("Pro") ? "pro" : "agency");

    // Force INR if UPI QR is selected (NPCI regulations require INR)
    const effectiveCurrency = paymentMethod === "upi_qr" ? "INR" : currency;

    try {
      // Step 1: Request trusted server-side order creation
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          billingCycle,
          email: email.trim(),
          paymentMethod,
          currency: effectiveCurrency,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || "Failed to create payment order.");
      }

      // If Razorpay keys are not yet set in .env.local, offer sandbox simulation
      if (orderData.isSandbox) {
        setSandboxOrderData({
          orderId: orderData.orderId,
          amount: orderData.amount,
          currency: orderData.currency,
          planName: orderData.planName,
          displayPrice: orderData.displayPrice,
        });
        setLoading(false);
        return;
      }

      // Step 2: Load Razorpay Standard Checkout SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Unable to load Razorpay payment gateway. Please check your connection.");
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RazorpayConstructor = (window as any).Razorpay;
      if (!RazorpayConstructor) {
        throw new Error("Razorpay SDK not initialized.");
      }

      const rawPhone = phone.trim() || "9876543210";
      const cleanPhone = rawPhone.replace(/\D/g, "");
      const formattedContact = rawPhone.startsWith("+")
        ? rawPhone
        : cleanPhone.length === 10
        ? `+91${cleanPhone}`
        : `+${cleanPhone}`;

      // Step 3: Configure Razorpay Checkout options with UPI QR and Card blocks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const options: any = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AdSpyAI.com",
        description: `${orderData.planName} (${billingCycle} subscription)`,
        order_id: orderData.orderId,
        prefill: {
          email: email.trim(),
          contact: formattedContact,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        theme: {
          color: "#0066FF",
          backdrop_color: "rgba(5, 11, 26, 0.95)",
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          setPendingStatus("Verifying payment signature with server...");
          // Step 4: Send signature to server for HMAC-SHA256 verification
          await handleVerifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            planId,
            billingCycle,
            email: email.trim(),
            currency: orderData.currency,
            paymentMethod,
          });
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setPendingStatus(null);
            if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
          },
        },
      };

      // Configure Method Display Preferences (UPI QR on top or Card on top)
      if (effectiveCurrency === "INR") {
        options.config = {
          display: {
            blocks: {
              upi: {
                name: "Pay via UPI (Google Pay, PhonePe, Paytm, QR)",
                instruments: [
                  {
                    method: "upi",
                    flows: ["qr", "intent", "collect"],
                  },
                ],
              },
              cards: {
                name: "Pay via Cards",
                instruments: [
                  {
                    method: "card",
                  },
                ],
              },
              other: {
                name: "Netbanking & Wallets",
                instruments: [
                  { method: "netbanking" },
                  { method: "wallet" },
                ],
              },
            },
            sequence:
              paymentMethod === "upi_qr"
                ? ["block.upi", "block.cards", "block.other"]
                : ["block.cards", "block.upi", "block.other"],
            preferences: {
              show_default_blocks: true,
            },
          },
        };
      }

      const rzpInstance = new RazorpayConstructor(options);

      // Start background status polling in case user scans QR on phone
      startOrderStatusPolling(orderData.orderId, email.trim(), planId);

      rzpInstance.open();
    } catch (err: unknown) {
      console.error("Checkout initiation error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Error initiating checkout.");
      setLoading(false);
      setPendingStatus(null);
    }
  };

  const handleVerifyPayment = async ({
    orderId,
    paymentId,
    signature,
    planId,
    billingCycle,
    email,
    currency,
    paymentMethod,
  }: {
    orderId: string;
    paymentId: string;
    signature: string;
    planId: string;
    billingCycle: string;
    email: string;
    currency: string;
    paymentMethod: string;
  }) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          paymentId,
          signature,
          planId,
          billingCycle,
          email,
          currency,
          paymentMethod,
        }),
      });

      const verifyData = await res.json();

      if (!res.ok) {
        throw new Error(verifyData.error || "Payment signature verification failed.");
      }

      // Save verified entitlement to localStorage
      const entitlement = verifyData.entitlement;
      localStorage.setItem("adspy_active_entitlement", JSON.stringify(entitlement));
      setActiveEntitlement(entitlement);
      setSandboxOrderData(null);
      setPendingStatus("Payment Verified! Subscription Active.");
      setTimeout(() => {
        setPendingStatus(null);
      }, 2000);
    } catch (err: unknown) {
      console.error("Payment verification error:", err);
      setErrorMessage(err instanceof Error ? err.message : "Payment verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // Pricing display helper
  const getDisplayPrice = (tier: PricingTier) => {
    if (tier.id === "free" || tier.name === "Free Beta") {
      return currency === "INR" ? "₹0" : "$0";
    }

    if (currency === "INR") {
      if (tier.id === "pro") {
        return billingCycle === "annual" ? "₹3,199" : "₹3,999";
      }
      return billingCycle === "annual" ? "₹9,599" : "₹11,999";
    }

    // USD
    if (tier.id === "pro") {
      return billingCycle === "annual" ? "$39" : "$49";
    }
    return billingCycle === "annual" ? "$119" : "$149";
  };

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-24 relative section-transition"
      style={{ background: "linear-gradient(180deg, #071329 0%, #050B1A 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B172E] border border-cyan-400/30 shadow-md shadow-blue-500/10 mb-4">
            <span className="text-xs font-black tracking-wider text-cyan-300 uppercase">
              💎 Transparent Access Plans · UPI QR & Cards Supported
            </span>
          </div>

          <h2
            id="pricing-heading"
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4"
          >
            Predictable Plans for <span className="bg-gradient-to-r from-[#00D4FF] to-[#0066FF] bg-clip-text text-transparent">Every Ambition</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Test for free right now. Upgrade with Razorpay UPI QR or Cards for unlimited real-time analyses and priority AI generation.
          </p>

          {/* Active Subscription Status Banner if active */}
          {activeEntitlement && (
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 p-3 px-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-sm shadow-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
              <span>
                <strong>Active Subscription:</strong> {activeEntitlement.planName} ({activeEntitlement.billingCycle}) assigned to <strong className="text-white">{activeEntitlement.email}</strong>.
              </span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("adspy_active_entitlement");
                  setActiveEntitlement(null);
                }}
                className="text-xs font-bold text-slate-400 hover:text-white underline ml-2 cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}

          {/* Controls Bar: Currency Selector + Billing Cycle Toggle */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 rounded-xl glass-card border border-white/10" role="group" aria-label="Currency Selector">
              <button
                type="button"
                onClick={() => setCurrency("INR")}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  currency === "INR"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>₹ INR (UPI / Cards)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrency("USD");
                  if (paymentMethod === "upi_qr") setPaymentMethod("card");
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  currency === "USD"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>$ USD (International)</span>
              </button>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center p-1 rounded-xl glass-card border border-white/10" role="group" aria-label="Billing Interval">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === "annual"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Annual
                <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[10px] font-black border border-emerald-400/30">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-4">
          {tiers.map((tier) => {
            const price = getDisplayPrice(tier);

            const isCurrentActive =
              activeEntitlement &&
              ((tier.id === "pro" && activeEntitlement.planId === "pro") ||
                (tier.id === "agency" && activeEntitlement.planId === "agency"));

            return (
              <div
                key={tier.name}
                className={`relative glass-card p-7 sm:p-8 rounded-3xl flex flex-col justify-between transition-all duration-300 ${
                  tier.highlighted
                    ? "border-2 border-cyan-400/80 shadow-[0_15px_50px_rgba(0,102,255,0.35)] bg-gradient-to-b from-[#09224E] via-[#07193B] to-[#050B1A] md:-translate-y-2 z-10"
                    : "border border-white/10 hover:border-cyan-500/30"
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 px-4 py-1.5 rounded-full text-xs font-black text-white uppercase tracking-wider shadow-lg shadow-cyan-500/30 border border-cyan-300">
                      ✦ Most Popular · Top Value
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl sm:text-3xl font-black text-white">{tier.name}</h3>
                      {isCurrentActive && (
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/40">
                          Active Plan
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-slate-200 min-h-[44px] leading-relaxed font-normal">{tier.description}</p>
                    <div className="flex items-baseline gap-1.5 mt-4">
                      <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                        {price}
                      </span>
                      <span className="text-slate-300 text-base font-semibold">/{tier.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3.5 mb-8 pt-4 border-t border-white/10" aria-label={`${tier.name} Features`}>
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-100 font-medium">
                        <span className="text-cyan-400 font-bold shrink-0 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleCta(tier)}
                  className={`w-full py-4 rounded-xl text-sm sm:text-base font-black transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[48px] cursor-pointer ${
                    isCurrentActive
                      ? "bg-emerald-600/30 text-emerald-300 border border-emerald-400/50"
                      : tier.highlighted
                      ? "glow-button text-white shadow-xl shadow-blue-600/40"
                      : "glass-card text-cyan-300 hover:text-white hover:border-cyan-400 border border-white/15"
                  }`}
                >
                  {isCurrentActive ? "Active Subscription ✓" : `${tier.cta} →`}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security & Payment Methods Banner */}
        <div className="text-center mt-12 text-slate-300 text-xs sm:text-sm flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-white">
            🔒 Secured by Razorpay Payments
          </span>
          <span className="text-slate-500">·</span>
          <span className="flex items-center gap-1.5">
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold text-xs border border-emerald-400/30">
              ⚡ UPI QR (GPay, PhonePe, Paytm, BHIM)
            </span>
            <span>+</span>
            <span className="bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold text-xs border border-cyan-400/30">
              💳 Credit & Debit Cards
            </span>
          </span>
          <span className="text-slate-500">·</span>
          <span>Instant Entitlement Activation</span>
        </div>
      </div>

      {/* RAZORPAY CHECKOUT MODAL */}
      {selectedPlan && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="glass-card-blue p-6 sm:p-8 rounded-3xl max-w-lg w-full border-2 border-cyan-400/60 shadow-2xl relative bg-[#071329] max-h-[90vh] overflow-y-auto">
            {/* Close Modal Button */}
            <button
              onClick={() => {
                setSelectedPlan(null);
                setErrorMessage("");
                setPendingStatus(null);
                setSandboxOrderData(null);
                if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
              }}
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 text-xl leading-none cursor-pointer"
              aria-label="Close dialog"
            >
              ✕
            </button>

            {/* Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="mb-4 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start justify-between gap-2"
              >
                <div>
                  <strong className="font-bold text-red-400 block">Payment Notice:</strong>
                  {errorMessage}
                </div>
                <button
                  type="button"
                  onClick={() => setErrorMessage("")}
                  className="text-red-400 font-bold px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Pending Status Notification */}
            {pendingStatus && (
              <div
                role="status"
                className="mb-4 p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-400/60 text-cyan-200 text-xs sm:text-sm flex items-center gap-2.5 animate-pulse"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>{pendingStatus}</span>
              </div>
            )}

            {/* Step 1: Active Entitlement Confirmation */}
            {activeEntitlement && activeEntitlement.planName === selectedPlan.name ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto border-2 border-emerald-400 shadow-xl shadow-emerald-500/20">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">
                  {selectedPlan.name} is Active!
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-sm mx-auto">
                  Your subscription is verified and active for <strong className="text-cyan-300">{activeEntitlement.email}</strong>. You have unlimited real-time ad teardowns.
                </p>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-left space-y-1.5 font-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Order ID:</span>
                    <span className="text-white font-bold">{activeEntitlement.orderId}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Payment ID:</span>
                    <span className="text-cyan-300 font-bold">{activeEntitlement.paymentId}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Status:</span>
                    <span className="text-emerald-400 font-bold">Verified (HMAC-SHA256)</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(null);
                    const elem = document.getElementById("preview");
                    if (elem) elem.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="glow-button px-7 py-3 rounded-xl font-bold text-white text-sm cursor-pointer"
                >
                  Go to Analyzer Now →
                </button>
              </div>
            ) : sandboxOrderData ? (
              /* Step 2: Sandbox Simulator View */
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/40">
                  ⚡ Razorpay Test Sandbox
                </div>

                <h3 className="text-2xl font-black text-white">
                  Order Created: {sandboxOrderData.planName}
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  This is a sandbox order preview only. No payment is processed and it cannot activate a paid plan.
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Order Reference:</span>
                    <strong className="text-white font-mono">{sandboxOrderData.orderId}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Amount:</span>
                    <strong className="text-cyan-300 font-bold">{sandboxOrderData.displayPrice} {sandboxOrderData.currency}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Customer Email:</span>
                    <strong className="text-white">{email}</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    type="button"
                    disabled={true}
                    className="glow-button w-full py-3.5 rounded-xl font-black text-white text-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? "Checking payment status..." : "Sandbox preview only — no payment or activation"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSandboxOrderData(null)}
                    className="px-4 py-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    ← Edit Email or Plan
                  </button>
                </div>
              </div>
            ) : (
              /* Step 3: Checkout Configuration Form with Payment Method Selector */
              <form onSubmit={handleInitiateCheckout} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-blue-600/30 text-cyan-300 text-xs font-black uppercase tracking-wider border border-blue-400/40">
                    Razorpay Checkout
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">Step 1 of 2</span>
                </div>

                <h3 id="checkout-modal-title" className="text-2xl sm:text-3xl font-black text-white">
                  {selectedPlan.name}
                </h3>

                {/* Plan Summary Card */}
                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Selected Plan:</span>
                    <strong className="text-white">{selectedPlan.name}</strong>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Billing Interval:</span>
                    <strong className="text-cyan-300 capitalize">{billingCycle} ({billingCycle === "annual" ? "Save 20%" : "Monthly"})</strong>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-white/10">
                    <span>Amount Due:</span>
                    <strong className="text-emerald-400 text-base font-black">
                      {paymentMethod === "upi_qr" || currency === "INR"
                        ? selectedPlan.id === "pro"
                          ? billingCycle === "annual" ? "₹38,388 / year (₹3,199/mo)" : "₹3,999 / month"
                          : billingCycle === "annual" ? "₹115,188 / year (₹9,599/mo)" : "₹11,999 / month"
                        : selectedPlan.id === "pro"
                          ? billingCycle === "annual" ? "$468 / year ($39/mo)" : "$49 / month"
                          : billingCycle === "annual" ? "$1,428 / year ($119/mo)" : "$149 / month"}
                    </strong>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* UPI QR Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("upi_qr");
                        setCurrency("INR"); // UPI strictly requires INR
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                        paymentMethod === "upi_qr"
                          ? "bg-blue-600/25 border-cyan-400 shadow-md shadow-blue-500/20"
                          : "bg-black/30 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>⚡</span> UPI QR / Apps
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black border border-emerald-400/30">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        Scan dynamic QR with Google Pay, PhonePe, Paytm, or BHIM.
                      </p>
                    </button>

                    {/* Card Option */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === "card"
                          ? "bg-blue-600/25 border-cyan-400 shadow-md shadow-blue-500/20"
                          : "bg-black/30 border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-sm text-white flex items-center gap-1.5">
                          <span>💳</span> Credit / Debit Card
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-tight">
                        Visa, Mastercard, RuPay, Amex with 3D Secure verification.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="checkout-email" className="block text-xs font-bold text-slate-300 mb-1.5">
                    Your Account & Receipt Email
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="creator@brand.com"
                    className="glow-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Your signed cryptographic entitlement token and invoice will be issued to this email.
                  </span>
                </div>

                {/* Mobile Number Field (Mandatory for UPI routing) */}
                <div>
                  <label htmlFor="checkout-phone" className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Mobile Number</span>
                    <span className="text-cyan-400 font-normal text-[11px]">NPCI & UPI identification</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    disabled={loading}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="glow-input w-full px-4 py-3 rounded-xl text-sm"
                  />
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Required by NPCI to trigger UPI apps (Google Pay, PhonePe, Paytm) and dynamic QR codes.
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="glow-button w-full py-3.5 rounded-xl font-black text-white text-base shadow-xl shadow-blue-600/40 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" strokeWidth="3" />
                        <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" />
                      </svg>
                      Opening Razorpay...
                    </>
                  ) : paymentMethod === "upi_qr" ? (
                    "Proceed to UPI QR Payment →"
                  ) : (
                    "Proceed to Card Payment →"
                  )}
                </button>

                <div className="pt-2 flex flex-col items-center gap-1.5 text-center">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span>Google Pay</span>
                    <span>·</span>
                    <span>PhonePe</span>
                    <span>·</span>
                    <span>Paytm</span>
                    <span>·</span>
                    <span>BHIM</span>
                    <span>·</span>
                    <span>Visa / RuPay</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    🔒 Official Razorpay Checkout · Desktop QR Scan & Mobile UPI Intent
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
