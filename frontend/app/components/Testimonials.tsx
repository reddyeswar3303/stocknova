"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Full-time Trader",
    tier: "Pro",
    content: "TradeVerse completely changed how I trade. The zero brokerage saves me thousands monthly, and the TradingView integration is world-class.",
    rating: 5,
    avatar: "RS",
    gain: "+₹1.2L",
    period: "this month",
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    tier: "Intermediate",
    content: "Started SIPs 8 months ago and I've already seen great returns. The portfolio analytics make it so easy to track everything in one place.",
    rating: 5,
    avatar: "PP",
    gain: "+18.4%",
    period: "8 months",
  },
  {
    name: "Amit Kumar",
    role: "Business Owner",
    tier: "Beginner",
    content: "The zero-brokerage delivery trades are a game-changer for a buy-and-hold investor like me. Mobile app is incredibly smooth.",
    rating: 5,
    avatar: "AK",
    gain: "+22.1%",
    period: "1 year",
  },
  {
    name: "Sneha Gupta",
    role: "Financial Analyst",
    tier: "Pro",
    content: "The multi-chart layout and advanced F&O tools rival Bloomberg terminals at a fraction of the cost. Support is always responsive.",
    rating: 5,
    avatar: "SG",
    gain: "+₹4.5L",
    period: "this year",
  },
];

const stats = [
  { value: 1.5, suffix: "M+", label: "Active Investors", prefix: "" },
  { value: 5000, suffix: "Cr+", label: "Daily Volume", prefix: "₹" },
  { value: 4.8, suffix: "★", label: "App Store Rating", prefix: "" },
  { value: 99.9, suffix: "%", label: "Platform Uptime", prefix: "" },
];

const tierColors: Record<string, { bg: string; text: string }> = {
  "Pro":           { bg: "#F3EEF9", text: "#7B5EA7" },
  "Intermediate":  { bg: "#E8FBF6", text: "#00D09C" },
  "Beginner":      { bg: "#E8FBF6", text: "#00D09C" },
};

function AnimatedCounter({ value, suffix, prefix }: { value: number; suffix: string; prefix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => value >= 100 ? Math.round(v) : Number(v.toFixed(1)));

  useEffect(() => {
    if (isInView) {
      const c = animate(count, value, { duration: 1.8, ease: "easeOut" });
      return c.stop;
    }
  }, [isInView, value, count]);

  return <span ref={ref}>{prefix}<motion.span>{rounded}</motion.span>{suffix}</span>;
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <section id="testimonials" className="py-24" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center py-8 px-4 rounded-2xl border"
              style={{ backgroundColor: "#F8F8F8", borderColor: "#E8E8E8" }}
              whileHover={{ y: -4, borderColor: "#00D09C" }}
            >
              <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: "#00D09C" }}>
                <AnimatedCounter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
              </p>
              <p className="text-sm font-medium" style={{ color: "#5F6368" }}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider" style={{ backgroundColor: "#FFF8E5", color: "#D4A017" }}>
            Loved by users
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#231F20", letterSpacing: "-0.02em" }}>
            Real people, real <span style={{ color: "#00D09C" }}>returns</span>
          </h2>
          <p className="text-lg" style={{ color: "#5F6368" }}>
            See how investors are growing wealth with TradeVerse
          </p>
        </motion.div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-2 gap-5">
          {testimonials.map((t, i) => {
            const tc = tierColors[t.tier] ?? { bg: "#E8FBF6", text: "#00D09C" };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl p-7 border cursor-pointer"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E8E8" }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: "#FFB800" }} />
                  ))}
                </div>

                <p className="text-base leading-relaxed mb-6" style={{ color: "#231F20" }}>
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: "#00D09C" }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#231F20" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "#5F6368" }}>{t.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold" style={{ color: "#00D09C" }}>{t.gain}</p>
                    <p className="text-xs" style={{ color: "#9AA0A6" }}>{t.period}</p>
                  </div>
                </div>

                <span className="mt-4 inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: tc.bg, color: tc.text }}>
                  {t.tier}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl p-6 border"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E8E8" }}
          >
            <div className="flex gap-1 mb-4">
              {[...Array(testimonials[current].rating)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-current" style={{ color: "#FFB800" }} />
              ))}
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#231F20" }}>
              &ldquo;{testimonials[current].content}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: "#00D09C" }}>
                {testimonials[current].avatar}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#231F20" }}>{testimonials[current].name}</p>
                <p className="text-xs" style={{ color: "#5F6368" }}>{testimonials[current].role}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-bold" style={{ color: "#00D09C" }}>{testimonials[current].gain}</p>
                <p className="text-xs" style={{ color: "#9AA0A6" }}>{testimonials[current].period}</p>
              </div>
            </div>
          </motion.div>
          <div className="flex justify-center items-center gap-4 mt-5">
            <motion.button onClick={() => setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length)} className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: "#E8E8E8" }} whileTap={{ scale: 0.9 }}>
              <ChevronLeft className="w-4 h-4" style={{ color: "#5F6368" }} />
            </motion.button>
            <div className="flex gap-1.5">
              {testimonials.map((_, i) => (
                <motion.button key={i} onClick={() => setCurrent(i)} className="w-2 h-2 rounded-full transition-colors" style={{ backgroundColor: i === current ? "#00D09C" : "#E8E8E8" }} whileHover={{ scale: 1.3 }} />
              ))}
            </div>
            <motion.button onClick={() => setCurrent((p) => (p + 1) % testimonials.length)} className="w-9 h-9 rounded-full border flex items-center justify-center" style={{ borderColor: "#E8E8E8" }} whileTap={{ scale: 0.9 }}>
              <ChevronRight className="w-4 h-4" style={{ color: "#5F6368" }} />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
