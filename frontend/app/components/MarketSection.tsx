"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { getStocks } from "../lib/api";

export default function MarketSection() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      const res = await getStocks();
      if (res.success) setStocks(res.data.slice(0, 12));
      setLoading(false);
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 10000); // 10s refresh for landing page
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#00D09C] font-bold text-sm mb-4">
              <div className="w-2 h-2 rounded-full bg-[#00D09C] animate-pulse" />
              LIVE MARKET DATA
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#231F20] tracking-tight mb-4">
              Watch the markets move in <span className="text-[#00D09C]">real-time</span>
            </h2>
            <p className="text-lg text-[#5F6368]">
              Experience the speed of professional trading. Our low-latency feeds keep you ahead of the curve.
            </p>
          </div>
          <Link href="/dashboard">
            <motion.span 
              className="inline-flex items-center gap-2 font-bold text-[#00D09C] hover:gap-3 transition-all cursor-pointer"
              whileHover={{ x: 5 }}
            >
              Go to Dashboard <ArrowRight className="w-5 h-5" />
            </motion.span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="wait">
            {loading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-gray-50 animate-pulse border border-gray-100" />
              ))
            ) : (
              stocks.map((stock) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,208,156,0.15)" }}
                  className="p-6 rounded-2xl border bg-white group hover:border-[#00D09C]/30 transition-all cursor-pointer"
                  style={{ borderColor: "#E8E8E8" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: stock.change >= 0 ? "#E8FBF6" : "#FFF0ED", color: stock.change >= 0 ? "#00D09C" : "#EB5B3C" }}>
                        {stock.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#231F20]">{stock.symbol}</h3>
                        <p className="text-xs text-[#5F6368] truncate max-w-[120px]">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#231F20]">₹{stock.price.toFixed(2)}</p>
                      <div className={`flex items-center justify-end gap-1 text-xs font-bold ${stock.change >= 0 ? 'text-[#00D09C]' : 'text-[#EB5B3C]'}`}>
                        {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${stock.change >= 0 ? 'bg-[#00D09C]' : 'bg-[#EB5B3C]'}`}
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.min(Math.abs(stock.change) * 20, 100)}%` }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div className="mt-16 p-8 rounded-[2rem] bg-[#231F20] text-white flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center lg:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[#00D09C]/10 flex items-center justify-center text-[#00D09C]">
              <Zap className="w-8 h-8 fill-current" />
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">Ultra-low latency infrastructure</p>
              <p className="text-[#9AA0A6]">Built for speed. 100ms execution time. 99.9% uptime.</p>
            </div>
          </div>
          <Link href="/auth">
            <motion.button 
              className="px-8 py-4 rounded-xl font-bold bg-[#00D09C] text-white shadow-lg shadow-[#00D09C]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Trading Now
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
