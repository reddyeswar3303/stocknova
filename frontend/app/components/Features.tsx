"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  BarChart3,
  Wallet,
  PieChart,
  Newspaper,
  LineChart,
  ShieldCheck,
  Smartphone,
  Clock,
  ArrowRight,
  Search
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Advanced Charting",
    description: "100+ technical indicators powered by TradingView for professional analysis",
    tag: "PRO",
  },
  {
    icon: Wallet,
    title: "Zero Brokerage",
    description: "Pay ₹0 on all delivery trades. Flat ₹20 on intraday and F&O",
    tag: "FREE",
  },
  {
    icon: PieChart,
    title: "Portfolio Analytics",
    description: "Track your investments with detailed holding reports and insights",
    tag: "LIVE",
  },
  {
    icon: Search,
    title: "Infinity Discovery",
    description: "Search and track 5,000+ NSE & BSE stocks, ETFs, and indices with live price feeds",
    tag: "NEW",
  },
  {
    icon: Newspaper,
    title: "Live Market News",
    description: "Real-time news headlines specifically curated for your selected stocks",
    tag: "LIVE",
  },
];

const tagColor: Record<string, { bg: string; text: string }> = {
  PRO:    { bg: "#F3EEF9", text: "#7B5EA7" },
  FREE:   { bg: "#E8FBF6", text: "#00D09C" },
  LIVE:   { bg: "#E8FBF6", text: "#00D09C" },
  SAFE:   { bg: "#E8FBF6", text: "#00D09C" },
  "4.8★": { bg: "#FFF8E5", text: "#D4A017" },
  ALWAYS: { bg: "#E8FBF6", text: "#00D09C" },
  NEW:    { bg: "#F3EEF9", text: "#7B5EA7" },
};

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const colors = tagColor[feature.tag] ?? { bg: "#E8FBF6", text: "#00D09C" };

  return (
    <Link href="/auth">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45 }}
        whileHover={{ y: -6, boxShadow: "0 12px 32px rgba(0,208,156,0.12)" }}
        className="group cursor-pointer rounded-2xl p-6 border transition-all duration-200"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E8E8E8",
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{ backgroundColor: "#E8FBF6" }}
        >
          <feature.icon className="w-6 h-6" style={{ color: "#00D09C" }} />
        </div>

        {/* Title + tag */}
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-base font-bold" style={{ color: "#231F20" }}>
            {feature.title}
          </h3>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {feature.tag}
          </span>
        </div>

        <p className="text-sm leading-relaxed" style={{ color: "#5F6368" }}>
          {feature.description}
        </p>

        {/* Learn more — shows on hover */}
        <div
          className="mt-4 flex items-center gap-1 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: "#00D09C" }}
        >
          Learn more <ArrowRight className="w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      className="py-24"
      id="features"
      style={{ backgroundColor: "#F8F8F8" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-block text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider"
            style={{ backgroundColor: "#E8FBF6", color: "#00D09C" }}
          >
            Why StockNova
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: "#231F20", letterSpacing: "-0.02em" }}
          >
            Everything to grow your
            <span style={{ color: "#00D09C" }}> wealth</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#5F6368" }}>
            From first investment to advanced trading — StockNova has tools for every stage of your journey.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
