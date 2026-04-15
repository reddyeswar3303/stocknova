"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

const tiers = [
  {
    name: "Beginner",
    emoji: "🌱",
    monthlyPrice: 0,
    yearlyPrice: 0,
    tagline: "For new investors exploring the markets",
    color: "#00D09C",
    colorLight: "#E8FBF6",
    features: [
      "₹10,000 Virtual Capital",
      "200+ NSE Stocks Discovery",
      "Zero brokerage on delivery trades",
      "Live market news feed",
      "Basic stock charting",
      "Stocks & Mutual Funds",
      "Mobile app trading",
    ],
    notIncluded: ["F&O trading", "Advanced charting", "Research reports", "Priority support"],
    popular: false,
    cta: "Start Free",
    startingBalance: 10000,
  },
  {
    name: "Intermediate",
    emoji: "⚡",
    monthlyPrice: 499,
    yearlyPrice: 4990,
    tagline: "For active traders who need power tools",
    color: "#00D09C",
    colorLight: "#E8FBF6",
    features: [
      "₹25,000 Virtual Capital",
      "Everything in Starter",
      "Real-time News & Insights",
      "F&O at ₹10/order",
      "50+ advanced indicators",
      "Intraday trading suite",
      "IPO & SME access",
      "Priority support",
      "Weekly research reports",
      "4-chart multi-layout",
    ],
    notIncluded: ["API access", "Relationship manager"],
    popular: true,
    cta: "Get Started",
    startingBalance: 25000,
  },
  {
    name: "Pro",
    emoji: "👑",
    monthlyPrice: 999,
    yearlyPrice: 9990,
    tagline: "For professionals who demand the best",
    color: "#7B5EA7",
    colorLight: "#F3EEF9",
    features: [
      "₹50,000 Virtual Capital",
      "Everything in Intermediate",
      "Zero brokerage on all trades",
      "100+ premium indicators",
      "8-chart multi-layout",
      "Algo trading API access",
      "24/7 priority phone support",
      "Dedicated relationship manager",
      "Daily advisory reports",
      "Custom trade strategies",
      "NRI account support",
    ],
    notIncluded: [],
    popular: false,
    cta: "Go Elite",
    startingBalance: 50000,
  },
];

function PricingCard({ tier, isYearly, isSelectionMode }: { tier: typeof tiers[0]; isYearly: boolean; isSelectionMode?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
  const savings = tier.monthlyPrice * 12 - tier.yearlyPrice;
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTierSelect = async () => {
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
    if (!isSelectionMode && !isLoggedIn) return;
    
    setIsLoading(true);
    
    const funds = tier.startingBalance || 10000;
    
    try {
      if (price === 0) {
        // Instant activation for free plan
        const storedUser = localStorage.getItem("user");
        const user = storedUser ? JSON.parse(storedUser) : null;
        
        const response = await (await import("../lib/api")).verifyPayment({
          paymentId: "FREE_PLAN_AUTO_" + Math.random().toString(36).substr(2, 5).toUpperCase(),
          amount: 0,
          userId: user?.id || user?._id,
          tierName: tier.name
        });

        if (response.success) {
          if (response.data?.updatedBalance) localStorage.setItem("availableFunds", response.data.updatedBalance.toString());
          localStorage.setItem("traderLevel", tier.name);
          window.location.assign("/dashboard");
          return;
        }
      }

      localStorage.setItem("traderLevel", tier.name);
      localStorage.setItem("availableFunds", funds.toString());
      window.location.href = `/payment?tier=${tier.name}&price=${price}`;
    } catch (error) {
      console.error("Failed to select tier:", error);
      window.location.href = `/payment?tier=${tier.name}&price=${price}`;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6 }}
      className="relative rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: tier.popular ? tier.color : "#E8E8E8",
        boxShadow: tier.popular ? `0 0 0 2px ${tier.color}` : undefined,
      }}
    >
      {/* Popular badge */}
      {tier.popular && (
        <div
          className="text-center py-2 text-xs font-bold text-white tracking-wider uppercase"
          style={{ backgroundColor: tier.color }}
        >
          Most Popular
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Plan header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{tier.emoji}</span>
            <h3 className="text-xl font-bold" style={{ color: "#231F20" }}>
              {tier.name}
            </h3>
          </div>
          <p className="text-sm" style={{ color: "#5F6368" }}>
            {tier.tagline}
          </p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={isYearly ? "y" : "m"}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold" style={{ color: "#231F20" }}>
                  {price === 0 ? "Free" : `₹${price}`}
                </span>
                {price > 0 && (
                  <span className="text-sm" style={{ color: "#9AA0A6" }}>
                    /{isYearly ? "year" : "month"}
                  </span>
                )}
              </div>
              {isYearly && savings > 0 && (
                <p className="text-xs font-semibold mt-1" style={{ color: "#00D09C" }}>
                  Save ₹{savings} per year
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        {(() => {
          // Fix Hydration: On first render (server/initial client), always show the Link version
          if (!mounted) {
            return (
              <Link href="/auth" className="mb-8">
                <motion.span
                  className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
                  style={{
                    backgroundColor: tier.popular || tier.name === "Pro" ? tier.color : "#F2F2F2",
                    color: tier.popular || tier.name === "Pro" ? "#FFFFFF" : "#231F20",
                  }}
                  whileHover={{ opacity: 0.9, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            );
          }

          const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("isLoggedIn") === "true";
          const shouldShowSelect = isSelectionMode || isLoggedIn;
          
          if (shouldShowSelect) {
            return (
              <button
                onClick={handleTierSelect}
                disabled={isLoading}
                className="mb-8 w-full"
              >
                <motion.span
                  className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: tier.popular || tier.name === "Pro" ? tier.color : "#F2F2F2",
                    color: tier.popular || tier.name === "Pro" ? "#FFFFFF" : "#231F20",
                  }}
                  whileHover={{ opacity: 0.9, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isLoading ? "Processing..." : tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </button>
            );
          } else {
            return (
              <Link href="/auth" className="mb-8">
                <motion.span
                  className="flex w-full items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer"
                  style={{
                    backgroundColor: tier.popular || tier.name === "Pro" ? tier.color : "#F2F2F2",
                    color: tier.popular || tier.name === "Pro" ? "#FFFFFF" : "#231F20",
                  }}
                  whileHover={{ opacity: 0.9, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {tier.cta}
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            );
          }
        })()}

        {/* Features */}
        <div className="space-y-3 flex-1">
          {tier.features.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "#E8FBF6" }}
              >
                <Check className="w-3 h-3" style={{ color: "#00D09C" }} />
              </div>
              <span className="text-sm" style={{ color: "#231F20" }}>
                {f}
              </span>
            </div>
          ))}
          {tier.notIncluded.map((f, i) => (
            <div key={i} className="flex items-start gap-2.5 opacity-40">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "#F2F2F2" }}
              >
                <X className="w-3 h-3" style={{ color: "#9AA0A6" }} />
              </div>
              <span className="text-sm line-through" style={{ color: "#9AA0A6" }}>
                {f}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Pricing({ isSelectionMode }: { isSelectionMode?: boolean }) {
  const [isYearly, setIsYearly] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="pricing" className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider"
            style={{ backgroundColor: "#E8FBF6", color: "#00D09C" }}
          >
            Pricing
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#231F20", letterSpacing: "-0.02em" }}
          >
            Simple, transparent pricing
          </h2>
          <p className="text-lg mb-8" style={{ color: "#5F6368" }}>
            Pick the plan that matches your trading style
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className="text-sm font-semibold"
              style={{ color: isYearly ? "#9AA0A6" : "#231F20" }}
            >
              Monthly
            </span>
            <motion.button
              onClick={() => setIsYearly(!isYearly)}
              className="relative w-14 h-7 rounded-full transition-colors duration-300"
              style={{ backgroundColor: isYearly ? "#00D09C" : "#E8E8E8" }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: isYearly ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
            <div className="flex items-center gap-2">
              <span
                className="text-sm font-semibold"
                style={{ color: isYearly ? "#231F20" : "#9AA0A6" }}
              >
                Yearly
              </span>
              {isYearly && (
                <motion.span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#E8FBF6", color: "#00D09C" }}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  Save 20%
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {tiers.map((tier, i) => (
            <PricingCard key={i} tier={tier} isYearly={isYearly} isSelectionMode={isSelectionMode} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm" style={{ color: "#9AA0A6" }}>
          All plans include SEBI regulation, bank-grade security, and mobile app.{" "}
          <button
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            className="underline font-medium transition-colors"
            style={{ color: "#00D09C" }}
          >
            Compare all features →
          </button>
        </p>
      </div>
    </section>
  );
}
