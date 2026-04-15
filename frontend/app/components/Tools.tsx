"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  CandlestickChart, Calculator, FileText, Bell,
  BookOpen, Target, TrendingUp, Layers, ArrowRight, Play, X
} from "lucide-react";

const tools = [
  { icon: CandlestickChart, title: "TradingView Charts",    desc: "100+ indicators & drawing tools for professional analysis", tag: "Charts" },
  { icon: Calculator,       title: "Brokerage Calculator",  desc: "Calculate exact costs for your trades before you execute", tag: "Tools" },
  { icon: FileText,         title: "SIP Planner",           desc: "Plan & track your monthly SIPs with goal-based projections", tag: "Invest" },
  { icon: Bell,             title: "Price Alerts",          desc: "Get push notifications when your stocks hit target prices", tag: "Alerts" },
  { icon: BookOpen,         title: "Learning Center",       desc: "Free investing & trading courses for every skill level", tag: "Learn" },
  { icon: Target,           title: "Goal Planner",          desc: "Set financial goals and get tailored investment recommendations", tag: "Goals" },
  { icon: TrendingUp,       title: "Stock Screener",        desc: "Filter stocks by fundamentals, technicals, and momentum", tag: "Screen" },
  { icon: Layers,           title: "Option Chain",          desc: "Real-time options data with Greeks and open interest", tag: "F&O" },
];

function ToolCard({ tool }: { tool: typeof tools[0] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <Link href="/auth">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        whileHover={{ y: -5, boxShadow: "0 8px 24px rgba(0,208,156,0.1)" }}
        className="group rounded-2xl p-5 cursor-pointer border transition-all"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#E8E8E8" }}
      >
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8FBF6" }}>
            <tool.icon className="w-5 h-5" style={{ color: "#00D09C" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-bold" style={{ color: "#231F20" }}>{tool.title}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "#F8F8F8", color: "#5F6368" }}>
                {tool.tag}
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#5F6368" }}>{tool.desc}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#00D09C" }}>
          Try it <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </motion.div>
    </Link>
  );
}

export default function Tools() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [showDemo, setShowDemo] = useState(false);

  return (
    <section id="tools" className="py-24" style={{ backgroundColor: "#F8F8F8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          ref={headerRef}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-xs font-bold px-4 py-2 rounded-full mb-4 uppercase tracking-wider" style={{ backgroundColor: "#E8FBF6", color: "#00D09C" }}>
            Tools & Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: "#231F20", letterSpacing: "-0.02em" }}>
            Smart tools for <span style={{ color: "#00D09C" }}>smarter</span> trading
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#5F6368" }}>
            A professional-grade toolkit to research, analyse, and execute your trades with confidence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {tools.map((tool, i) => <ToolCard key={i} tool={tool} />)}
        </div>

        {/* CTA Banner — Groww style */}
        <motion.div
          className="rounded-2xl p-10 flex flex-col lg:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: "#00D09C" }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Ready to start your investment journey?
            </h3>
            <p className="text-white/80 text-base">
              Join 1.5M+ investors already growing wealth on TradeVerse.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <Link href="/auth">
              <motion.span
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold cursor-pointer"
                style={{ backgroundColor: "#FFFFFF", color: "#00D09C" }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Open Account <ArrowRight className="w-4 h-4" />
              </motion.span>
            </Link>
            <motion.button
              onClick={() => setShowDemo(true)}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border-2 border-white/40 text-white"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Play className="w-4 h-4" /> Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Demo Modal */}
      {showDemo && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            className="bg-white rounded-2xl p-8 max-w-lg w-full"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold" style={{ color: "#231F20" }}>Product Demo</h3>
              <button onClick={() => setShowDemo(false)} className="p-2 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5" style={{ color: "#5F6368" }} />
              </button>
            </div>
            <div className="aspect-video rounded-xl flex items-center justify-center" style={{ backgroundColor: "#F8F8F8" }}>
              <div className="text-center">
                <Play className="w-12 h-12 mx-auto mb-3" style={{ color: "#00D09C" }} />
                <p className="text-sm font-medium" style={{ color: "#5F6368" }}>Demo video coming soon!</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
