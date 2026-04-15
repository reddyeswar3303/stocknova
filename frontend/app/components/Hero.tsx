"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Shield, Zap, ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const defaultIndices = [
  { label: "NIFTY 50", value: "22,456.80", change: "+101.20", pct: "+0.45%", up: true },
  { label: "SENSEX", value: "74,120.46", change: "+280.50", pct: "+0.38%", up: true },
  { label: "BANK NIFTY", value: "48,920.30", change: "-58.40", pct: "-0.12%", up: false },
  { label: "MIDCAP 100", value: "13,245.60", change: "+45.20", pct: "+0.34%", up: true },
];

export default function Hero() {
  const [timeframe, setTimeframe] = useState("1W");
  const [liveIndices, setLiveIndices] = useState(defaultIndices);

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "http://localhost:5000");
    
    socket.on('stockUpdates', (updates: any[]) => {
      if (updates && updates.length >= 4) {
        // Just map a few first updates to the ticker slots
        const mapped = updates.slice(0, 4).map(u => ({
          label: u.symbol,
          value: u.price.toFixed(2),
          change: (u.change >= 0 ? "+" : "") + "₹" + Math.abs(u.price * (u.change / 100)).toFixed(2),
          pct: (u.change >= 0 ? "+" : "") + u.change + "%",
          up: u.change >= 0
        }));
        setLiveIndices(mapped);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const chartData = {
    "1D": [
      {h: 15, up: false}, {h: 25, up: true}, {h: 20, up: false}, 
      {h: 40, up: true}, {h: 35, up: false}, {h: 60, up: true}, 
      {h: 50, up: false}, {h: 70, up: true}, {h: 65, up: false}
    ],
    "1W": [
      {h: 30, up: true}, {h: 45, up: false}, {h: 40, up: true}, 
      {h: 60, up: true}, {h: 55, up: false}, {h: 75, up: true}, 
      {h: 65, up: false}, {h: 85, up: true}, {h: 95, up: true}
    ],
    "1M": [
      {h: 50, up: true}, {h: 40, up: false}, {h: 60, up: true}, 
      {h: 80, up: true}, {h: 70, up: false}, {h: 50, up: false}, 
      {h: 65, up: true}, {h: 90, up: true}, {h: 85, up: false}
    ]
  };

  const getTabClass = (tab: string) => {
    return timeframe === tab 
      ? "px-3 py-1 rounded-lg bg-[#00D09C]/20 text-[#00D09C] text-xs font-medium border border-[#00D09C]/30 backdrop-blur-sm shadow-[0_0_15px_rgba(0,208,156,0.2)] cursor-pointer"
      : "px-3 py-1 rounded-lg bg-white/5 text-white/50 text-xs font-medium border border-white/10 backdrop-blur-sm cursor-pointer hover:text-white transition-colors"
  };

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="pt-20 pb-0 overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Ticker bar — Groww-style */}
      <div
        className="border-b py-2 overflow-hidden"
        style={{ borderColor: "#E8E8E8", backgroundColor: "#FAFAFA" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
            {liveIndices.map((idx) => (
              <div key={idx.label} className="flex items-center gap-3 flex-shrink-0 py-1">
                <span className="text-xs font-semibold" style={{ color: "#5F6368" }}>
                  {idx.label}
                </span>
                <span className="text-sm font-bold" style={{ color: "#231F20" }}>
                  {idx.value}
                </span>
                <span
                  className="text-xs font-semibold flex items-center gap-0.5"
                  style={{ color: idx.up ? "#00D09C" : "#EB5B3C" }}
                >
                  {idx.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {idx.pct}
                </span>
              </div>
            ))}
            <span
              className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: "#E8FBF6", color: "#00D09C" }}
            >
              ● Market Open
            </span>
          </div>
        </div>
      </div>

      {/* Hero body */}
      <div
        className="py-16 md:py-24"
        style={{
          background: "linear-gradient(180deg, #F0FBF8 0%, #FFFFFF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Content */}
            <div className="space-y-8">
              {/* Trust pill */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "#E8FBF6", color: "#00D09C" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex -space-x-1">
                  {["RS", "PP", "AK"].map((av, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: "#00D09C", marginLeft: i > 0 ? "-4px" : "0" }}
                    >
                      {av[0]}
                    </div>
                  ))}
                </div>
                1.5M+ traders trust us
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1
                  className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                  style={{ color: "#231F20", letterSpacing: "-0.03em" }}
                >
                  Start as a{" "}
                  <span style={{ color: "#00D09C" }}>Beginner,</span>
                  <br />
                  <span style={{ color: "#00D09C" }}>Intermediate,</span>{" "}
                  or Pro
                </h1>
              </motion.div>

              <motion.p
                className="text-lg leading-relaxed max-w-lg"
                style={{ color: "#5F6368" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Explore trading at your level. Beginner (₹199), Intermediate (₹499), or Pro (₹999). Zero brokerage on delivery trades. Start today!
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/auth">
                  <motion.span
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-white cursor-pointer text-base"
                    style={{ backgroundColor: "#00D09C" }}
                    whileHover={{ backgroundColor: "#00A87D", scale: 1.02 } as any}
                    whileTap={{ scale: 0.97 }}
                  >
                    Start Investing
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </Link>
                <motion.button
                  onClick={scrollToPricing}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold border text-base"
                  style={{ color: "#231F20", borderColor: "#E8E8E8", backgroundColor: "#FFFFFF" }}
                  whileHover={{ borderColor: "#00D09C", color: "#00D09C" } as any}
                  whileTap={{ scale: 0.97 }}
                >
                  See Plans
                </motion.button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                className="flex flex-wrap items-center gap-6 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  { icon: Shield, label: "SEBI Regulated" },
                  { icon: Zap, label: "₹0 Delivery Brokerage" },
                  { icon: Star, label: "4.8★ App Rating" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: "#00D09C" }} />
                    <span className="text-sm font-medium" style={{ color: "#5F6368" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — Special Tiers Showcase */}
            <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
               
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-tr from-[#00D09C]/20 to-indigo-500/10 rounded-full blur-3xl opacity-60" />

               {/* Beginner Card (Back Left) */}
               <motion.div
                 className="absolute w-[240px] sm:w-[260px] md:w-[300px] rounded-2xl p-6 shadow-2xl border cursor-pointer"
                 style={{
                   backgroundColor: "rgba(255, 255, 255, 0.9)",
                   borderColor: "#E8E8E8",
                   backdropFilter: "blur(12px)",
                   zIndex: 10
                 }}
                 initial={{ opacity: 0, x: -60, y: -40, rotate: -8 }}
                 animate={{ opacity: 1, x: -40, y: -20, rotate: -6 }}
                 transition={{ duration: 0.8, delay: 0.2 }}
                 whileHover={{ y: -30, rotate: -2, zIndex: 40, scale: 1.05 }}
               >
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200">
                       B
                    </div>
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">₹199/mo</span>
                 </div>
                 <h3 className="text-xl font-bold text-gray-800 mb-1">Beginner</h3>
                 <p className="text-xs sm:text-sm text-gray-500 mb-4">Essential tools to start learning.</p>
                 <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-emerald-400 rounded-full" /></div>
                    <div className="h-2 w-4/5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-1/4 bg-emerald-400 rounded-full" /></div>
                 </div>
               </motion.div>

               {/* Intermediate Card (Back Right) */}
               <motion.div
                 className="absolute w-[240px] sm:w-[260px] md:w-[300px] rounded-2xl p-6 shadow-2xl border cursor-pointer"
                 style={{
                   backgroundColor: "rgba(255, 255, 255, 0.95)",
                   borderColor: "#00D09C",
                   backdropFilter: "blur(12px)",
                   zIndex: 20
                 }}
                 initial={{ opacity: 0, x: 20, y: 30, rotate: 8 }}
                 animate={{ opacity: 1, x: 40, y: 20, rotate: 6 }}
                 transition={{ duration: 0.8, delay: 0.4 }}
                 whileHover={{ y: 0, rotate: 2, zIndex: 40, scale: 1.05 }}
               >
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#00D09C]/20 flex items-center justify-center text-[#00D09C] font-bold border border-[#00D09C]/30 shadow-[0_0_15px_rgba(0,208,156,0.3)]">
                       I
                    </div>
                    <span className="bg-[#00D09C] text-white px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">₹499/mo</span>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 mb-1">Intermediate</h3>
                 <p className="text-xs sm:text-sm text-gray-500 mb-4">Advanced scanners & analytics.</p>
                 <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-2/3 bg-[#00D09C] rounded-full" /></div>
                    <div className="h-2 w-5/6 bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-1/2 bg-[#00D09C] rounded-full" /></div>
                    <div className="h-2 w-3/4 bg-gray-100 rounded-full overflow-hidden"><div className="h-full w-1/3 bg-[#00D09C] rounded-full" /></div>
                 </div>
               </motion.div>

               {/* Pro Card (Front Center) */}
               <motion.div
                 className="absolute w-[250px] sm:w-[270px] md:w-[310px] rounded-2xl p-6 shadow-2xl border cursor-pointer"
                 style={{
                   background: "linear-gradient(145deg, #111827 0%, #1F2937 100%)",
                   borderColor: "#374151",
                   zIndex: 30
                 }}
                 initial={{ opacity: 0, y: 60 }}
                 animate={{ opacity: 1, y: 0, x: 0 }}
                 transition={{ duration: 0.8, delay: 0.6 }}
                 whileHover={{ y: -15, scale: 1.05 }}
               >
                 <div className="absolute -top-3 -right-3">
                    <div className="relative flex min-h-[24px] min-w-[24px]">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-6 w-6 bg-indigo-500 items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                       </span>
                    </div>
                 </div>
                 
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                       P
                    </div>
                    <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest">₹999/mo</span>
                 </div>
                 <h3 className="text-xl font-bold text-white mb-1">Pro + Algo</h3>
                 <p className="text-xs sm:text-sm text-gray-400 mb-6">Unrestricted algorithmic trading access.</p>
                 
                 <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs text-gray-400">System Load</span>
                       <span className="text-xs text-[#00D09C] font-semibold flex items-center gap-1"><Zap className="w-3 h-3"/> Optimal</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
                       <motion.div 
                          className="h-full bg-indigo-500 rounded-full"
                          initial={{ width: "20%" }} 
                          animate={{ width: ["20%", "70%", "45%", "85%"] }} 
                          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                       />
                    </div>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
