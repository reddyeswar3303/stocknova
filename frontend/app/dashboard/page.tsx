"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import {
  PieChart, History, Wallet, CreditCard, BarChart3, Settings,
  Bell, Search, ArrowUpRight, ArrowDownRight, LogOut, User,
  X, Plus, Minus, CheckCircle, AlertCircle, RefreshCw,
  Download, ChevronRight, TrendingUp, TrendingDown, Shield,
  MoreHorizontal, Award, LayoutDashboard, Smartphone, Building2
} from "lucide-react";
import Link from "next/link";
import AnimatedLogout from "../components/AnimatedLogout";
import BouncyClock from "../components/BouncyClock";
import AnimatedSearch from "../components/AnimatedSearch";
import SparkleNavbar from "../components/SparkleNavbar";
import InteractiveCardForm from "../components/InteractiveCardForm";
import {
  getStocks, getPortfolio, getHoldings, getTrades,
  getFundTransactions, executeTrade, addFunds, withdrawFunds,
  searchStocks, trackStock, getMarketMovers, getNews, getStockDetails,
} from "../lib/api";

// ─── Groww color constants ────────────────────────────────────────────────────
const G = {
  green: "#00D09C", greenDark: "#00A87D", greenLight: "#E8FBF6",
  red: "#EB5B3C", redLight: "#FFF0ED",
  bg: "#F8F8F8", white: "#FFFFFF",
  text: "#231F20", secondary: "#5F6368", muted: "#9AA0A6",
  border: "#E8E8E8",
};

const safeFixed = (val: any, d = 2) => { const n = parseFloat(val); return isNaN(n) ? "0.00" : n.toFixed(d); };
const fmt = (v: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);

// ─── Fallback data ────────────────────────────────────────────────────────────
const fallbackStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2984.60,  change: -0.45, volume: "12.5M", ltp: 2984.60 },
  { symbol: "TCS",      name: "TCS Ltd",            price: 4012.30,  change: 1.15,  volume: "5.2M",  ltp: 4012.30 },
  { symbol: "HDFCBANK", name: "HDFC Bank",          price: 1532.70,  change: -0.65, volume: "15.1M", ltp: 1532.70 },
  { symbol: "INFY",     name: "Infosys Ltd",        price: 1478.40,  change: 0.85,  volume: "9.3M",  ltp: 1478.40 },
  { symbol: "SBIN",     name: "State Bank of India",price: 768.15,   change: -0.15, volume: "22.4M", ltp: 768.15  },
  { symbol: "TATASTEEL", name: "Tata Steel",        price: 165.40,   change: 1.25,  volume: "25.1M", ltp: 165.40  },
  { symbol: "ADANIPORTS", name: "Adani Ports",      price: 1342.10,  change: 2.10,  volume: "4.5M",  ltp: 1342.10 },
  { symbol: "ASIANPAINT", name: "Asian Paints",     price: 2854.20,  change: -0.50, volume: "2.1M",  ltp: 2854.20 },
  { symbol: "WIPRO",    name: "Wipro",              price: 482.40,   change: -0.55, volume: "7.3M",  ltp: 482.40  },
];
const fallbackHoldings = [
  { symbol:"RELIANCE", name:"Reliance Industries", quantity:50,  avgPrice:2850,   currentPrice:2984.60, invested:142500, currentValue:149230,   pnl:6730,    pnlPercent:4.72 },
  { symbol:"TCS",      name:"Tata Consultancy",   quantity:25,  avgPrice:3850,   currentPrice:4012.30, invested:96250,  currentValue:100307.5, pnl:4057.5,  pnlPercent:4.21 },
  { symbol:"HDFCBANK", name:"HDFC Bank",          quantity:100, avgPrice:1480,   currentPrice:1532.70, invested:148000, currentValue:153270,   pnl:5270,    pnlPercent:3.56 },
  { symbol:"INFY",     name:"Infosys Ltd",        quantity:75,  avgPrice:1420,   currentPrice:1478.40, invested:106500, currentValue:110880,   pnl:4380,    pnlPercent:4.11 },
  { symbol:"SBIN",     name:"State Bank of India",quantity:200, avgPrice:720,    currentPrice:768.15,  invested:144000, currentValue:153630,   pnl:9630,    pnlPercent:6.69 },
];

// ─── Groww-style LIVE Chart ──────────────────────────────────────────────────
const RANGES = ["1D", "1W", "1M", "3M", "1Y"] as const;
type Range = typeof RANGES[number];

function buildData(symbol: string, price: number, change: number, range: Range): number[] {
  const count = range === "1D" ? 78 : range === "1W" ? 5 * 20 : range === "1M" ? 90 : range === "3M" ? 90 : 260;
  const seed = symbol.split("").reduce((a, c) => a + c.charCodeAt(0), 0) * 17 + price;
  const sn = (i: number, f: number) => Math.sin(seed * 0.01 + i * f);
  // Start from prev-close and bias toward today's change
  let cur = price / (1 + change / 100);
  const bias = (change / 100) / count;
  return Array.from({ length: count }, (_, i) => {
    const noise = (sn(i, 0.41) * 0.5 + sn(i, 0.13) * 0.3 + sn(i, 0.07) * 0.2) * price * 0.004;
    cur = cur * (1 + bias) + noise;
    return parseFloat(cur.toFixed(2));
  });
}

function smoothPath(pts: number[], W: number, H: number, pad: number): string {
  if (pts.length < 2) return "";
  const min = Math.min(...pts) - pad, max = Math.max(...pts) + pad;
  const y = (v: number) => H - ((v - min) / (max - min)) * (H - 8) - 4;
  const x = (i: number) => (i / (pts.length - 1)) * W;
  let d = `M${x(0).toFixed(1)},${y(pts[0]).toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cx = (x(i - 1) + x(i)) / 2;
    d += ` C${cx.toFixed(1)},${y(pts[i - 1]).toFixed(1)} ${cx.toFixed(1)},${y(pts[i]).toFixed(1)} ${x(i).toFixed(1)},${y(pts[i]).toFixed(1)}`;
  }
  return d;
}

function LiveChart({ stock }: { stock: typeof fallbackStocks[0] }) {
  const [range, setRange] = useState<Range>("1D");
  const [pts, setPts] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Fetch real intraday data from Yahoo Finance (via our API route)
  const fetchChart = useCallback(async (sym: string, p: number, chg: number, r: Range) => {
    if (r !== "1D") {
      // Non-1D: use smooth simulated data
      setPts(buildData(sym, p, chg, r));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/chart/${sym}`);
      const json = await res.json();
      if (json.success && json.data.prices.length > 3) {
        setPts(json.data.prices);
      } else {
        setPts(buildData(sym, p, chg, r)); // fallback
      }
    } catch {
      setPts(buildData(sym, p, chg, r));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChart(stock.symbol, stock.price, stock.change, range);
  }, [stock.symbol, stock.price, stock.change, range, fetchChart]);

  // Re-fetch real data every 60 s in 1D mode
  useEffect(() => {
    if (range !== "1D") return;
    const id = setInterval(() => fetchChart(stock.symbol, stock.price, stock.change, range), 60_000);
    return () => clearInterval(id);
  }, [range, stock.symbol, stock.price, stock.change, fetchChart]);

  // Micro-tick every 1 s to simulate live quotes between API refreshes
  useEffect(() => {
    if (range !== "1D") return;
    const id = setInterval(() => {
      setPts(prev => {
        if (!prev.length) return prev;
        const last = prev[prev.length - 1];
        const noise = (Math.random() - 0.48) * last * 0.0003;
        return [...prev.slice(-200), parseFloat((last + noise).toFixed(2))];
      });
    }, 1000);
    return () => clearInterval(id);
  }, [range]);

  const W = 500, H = 130;
  const openPrice = pts[0] ?? stock.price;
  const curPrice  = pts[pts.length - 1] ?? stock.price;
  const priceDiff = curPrice - openPrice;
  const pctChange = openPrice ? (priceDiff / openPrice) * 100 : 0;
  const isUp = pctChange >= 0;
  const color = isUp ? G.green : G.red;
  const fillId = `gfill-${stock.symbol}`;
  const pad = ((Math.max(...(pts.length ? pts : [stock.price])) - Math.min(...(pts.length ? pts : [stock.price]))) * 0.12) || 3;

  const pmin = pts.length ? Math.min(...pts) - pad : stock.price - 10;
  const pmax = pts.length ? Math.max(...pts) + pad : stock.price + 10;
  const toY = (v: number) => H - ((v - pmin) / (pmax - pmin)) * (H - 8) - 4;
  const toX = (i: number) => pts.length > 1 ? (i / (pts.length - 1)) * W : 0;

  const linePath = smoothPath(pts, W, H, pad);
  const areaPath = linePath ? `${linePath} L${W},${H} L0,${H} Z` : "";
  const lastX = pts.length ? toX(pts.length - 1) : W;
  const lastY = pts.length ? toY(curPrice) : H / 2;

  const hoverPrice = hoverIdx !== null && pts[hoverIdx] ? pts[hoverIdx] : null;
  const hoverX = hoverIdx !== null ? toX(hoverIdx) : null;
  const hoverY = hoverIdx !== null && pts[hoverIdx] ? toY(pts[hoverIdx]) : null;

  const timeLabels: Record<Range, string[]> = {
    "1D": ["9:15", "11:00", "1:00", "3:30"],
    "1W": ["Mon", "Tue", "Wed", "Thu", "Fri"],
    "1M": ["Wk 1", "Wk 2", "Wk 3", "Wk 4"],
    "3M": ["Jan", "Feb", "Mar"],
    "1Y": ["Q1", "Q2", "Q3", "Q4"],
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !pts.length) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const idx = Math.round((relX / rect.width) * (pts.length - 1));
    setHoverIdx(Math.max(0, Math.min(pts.length - 1, idx)));
  }, [pts.length]);

  return (
    <div className="rounded-xl mb-4 overflow-hidden" style={{ backgroundColor: G.white, border: `1px solid ${G.border}` }}>
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold" style={{ color }}>
            {isUp ? "▲" : "▼"} {isUp ? "+" : ""}{pctChange.toFixed(2)}%
          </span>
          <span className="text-xs font-medium" style={{ color: G.muted }}>
            {isUp ? "+" : ""}₹{priceDiff.toFixed(2)}
          </span>
        </div>
        {range === "1D" && (
          <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: G.greenLight, color: G.green }}>
            {loading
              ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              : <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
            {loading ? "Loading…" : "LIVE"}
          </span>
        )}
        <span className="text-sm font-bold" style={{ color: G.text }}>
          ₹{(hoverPrice ?? curPrice).toFixed(2)}
        </span>
      </div>

      {/* SVG */}
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 140, display: "block", cursor: "crosshair" }}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="85%" stopColor={color} stopOpacity="0.03" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {areaPath && <path d={areaPath} fill={`url(#${fillId})`} />}
        {linePath && <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Hover crosshair */}
        {hoverX !== null && hoverY !== null && (
          <>
            <line x1={hoverX} y1={0} x2={hoverX} y2={H} stroke={G.muted} strokeWidth="0.8" strokeDasharray="3 3" />
            <circle cx={hoverX} cy={hoverY} r="4" fill={color} stroke={G.white} strokeWidth="2" />
          </>
        )}

        {/* Live pulsing dot */}
        {hoverIdx === null && (
          <>
            <circle cx={lastX} cy={lastY} r="6" fill={color} opacity="0.2">
              <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={lastX} cy={lastY} r="3.5" fill={color} stroke={G.white} strokeWidth="1.5" />
          </>
        )}
      </svg>

      {/* Time axis */}
      <div className="flex justify-between px-4 pb-2">
        {timeLabels[range].map(t => (
          <span key={t} className="text-xs" style={{ color: G.muted }}>{t}</span>
        ))}
      </div>

      {/* Range buttons */}
      <div className="flex gap-1 px-4 pb-3">
        {RANGES.map(r => (
          <button key={r} onClick={() => setRange(r)}
            className="flex-1 py-1 rounded-lg text-xs font-bold transition-colors"
            style={{
              backgroundColor: range === r ? color : G.bg,
              color: range === r ? G.white : G.muted,
            }}>
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Groww-style toggle ───────────────────────────────────────────────────────
function GToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <motion.button
      onClick={onChange}
      className="relative w-11 h-6 rounded-full transition-colors"
      style={{ backgroundColor: checked ? G.green : G.border }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
        animate={{ left: checked ? "22px" : "2px" }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.button>
  );
}

// ─── Trade Modal (Groww style) ────────────────────────────────────────────────
function TradeModal({ isOpen, onClose, type, stock, onTrade, portfolio, holdings }: any) {
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  if (!isOpen) return null;
  const total = qty * stock.price;

  const handle = async () => {
    if (type === "buy" && total > portfolio.availableFunds) {
      alert(`Insufficient funds. Available: ₹${portfolio.availableFunds.toLocaleString("en-IN")}`);
      return;
    }
    if (type === "sell") {
      const owned = holdings.find((h: any) => h.symbol === stock.symbol)?.quantity || 0;
      if (qty > owned) {
        alert(`Insufficient holdings. You own ${owned} shares.`);
        return;
      }
    }
    setBusy(true);
    await new Promise(r => setTimeout(r, 800));
    onTrade({ type, stock: stock.symbol, name: stock.name, quantity: qty, price: stock.price });
    setBusy(false); setOk(true);
    setTimeout(() => { setOk(false); setQty(1); onClose(); }, 1500);
  };

  return (
    <motion.div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: G.white }}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        onClick={e => e.stopPropagation()}>
        {ok ? (
          <div className="py-8 text-center">
            <CheckCircle className="w-14 h-14 mx-auto mb-3" style={{ color: G.green }} />
            <p className="font-bold text-lg" style={{ color: G.text }}>Order {type === "buy" ? "Placed!" : "Sold!"}</p>
            <p className="text-sm mt-1" style={{ color: G.secondary }}>{qty} × {stock.symbol} @ ₹{stock.price.toFixed(2)}</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-5">
              <div>
                <p className="font-bold text-lg" style={{ color: G.text }}>{type === "buy" ? "Buy" : "Sell"} {stock.symbol}</p>
                <p className="text-xs" style={{ color: G.secondary }}>{stock.name}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full" style={{ backgroundColor: G.bg }}><X className="w-4 h-4" /></button>
            </div>

            <div className="flex justify-between items-center p-4 rounded-xl mb-4" style={{ backgroundColor: G.bg }}>
              <span className="text-sm" style={{ color: G.secondary }}>Current Price</span>
              <div className="text-right">
                <p className="font-bold" style={{ color: G.text }}>₹{stock.price.toFixed(2)}</p>
                <p className="text-xs font-semibold" style={{ color: stock.change >= 0 ? G.green : G.red }}>
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-2" style={{ color: G.secondary }}>Quantity</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: G.bg }}><Minus className="w-4 h-4" /></button>
                <input type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 text-center font-bold text-xl py-2 rounded-xl border" style={{ borderColor: G.border }} />
                <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: G.bg }}><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex justify-between p-4 rounded-xl mb-5" style={{ backgroundColor: G.bg }}>
              <span className="font-semibold" style={{ color: G.text }}>Total</span>
              <span className="font-bold text-lg" style={{ color: G.text }}>₹{total.toLocaleString("en-IN")}</span>
            </div>

            <motion.button onClick={handle} disabled={busy}
              className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-70"
              style={{ backgroundColor: type === "buy" ? G.green : G.red }}
              whileHover={{ opacity: 0.9 }} whileTap={{ scale: 0.98 }}>
              {busy ? <motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} /> : `${type === "buy" ? "Buy" : "Sell"} Now`}
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Funds Modal (Groww style) ────────────────────────────────────────────────
// ─── Funds Modal (Groww style) ────────────────────────────────────────────────
function FundsModal({ isOpen, onClose, type, onComplete, limit }: any) {
  const [amount, setAmount] = useState("");
  const [upiId, setUpiId] = useState("");
  const [busy, setBusy] = useState(false);
  const [ok, setOk] = useState(false);
  const [step, setStep] = useState(0); // 0: amount, 1: choice, 2: details
  const [method, setMethod] = useState(""); // upi, card, nb
  const [cardData, setCardData] = useState({ 
    number: "", 
    name: "FULL NAME", 
    expiryMonth: "", 
    expiryYear: "", 
    cvv: "" 
  });
  
  if (!isOpen) return null;
  const quick = [1000, 5000, 10000, 25000, 50000];

  const handle = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setBusy(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate gateway
    setBusy(false); setOk(true); 
    onComplete(parseFloat(amount), upiId);
    setTimeout(() => { 
      setOk(false); setAmount(""); setUpiId(""); setStep(0); setMethod(""); onClose(); 
    }, 1500);
  };

  const nextStep = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    if (type === "add") setStep(1);
    else handle();
  };

  return (
    <motion.div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="w-full max-w-sm rounded-[2rem] p-8 shadow-2xl relative overflow-hidden" 
        style={{ backgroundColor: G.white }}
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        onClick={e => e.stopPropagation()}>
        
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50" />

        {ok ? (
          <div className="py-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}>
              <CheckCircle className="w-16 h-16 mx-auto mb-4" style={{ color: G.green }} />
            </motion.div>
            <h3 className="font-black text-xl mb-1" style={{ color: G.text }}>{type === "add" ? "Funds Added!" : "Transferred!"}</h3>
            <p className="text-sm font-bold opacity-60" style={{ color: G.secondary }}>₹{parseFloat(amount).toLocaleString("en-IN")}</p>
          </div>
        ) : step === 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-xl" style={{ color: G.text }}>{type === "add" ? "Add Funds" : "Withdraw"}</h2>
              <button onClick={onClose} className="p-2 rounded-xl text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-wider">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-2xl text-gray-300">₹</span>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-5 text-3xl font-black rounded-2xl border-2 outline-none"
                    style={{ borderColor: G.border, color: G.text }} />
                </div>
              </div>

              {type === "withdraw" && (
                <div>
                  <label className="text-[10px] font-black text-gray-400 mb-2 block uppercase tracking-wider">UPI ID</label>
                  <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="user@bank"
                    className="w-full px-5 py-4 text-base font-bold rounded-2xl border-2 outline-none"
                    style={{ borderColor: G.border, color: G.text }} />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {quick.map(a => (
                  <button key={a} onClick={() => setAmount(a.toString())}
                    className="px-4 py-2.5 rounded-xl text-xs font-black border-2"
                    style={{ 
                      backgroundColor: amount === a.toString() ? G.greenLight : "transparent", 
                      color: amount === a.toString() ? G.green : G.muted,
                      borderColor: amount === a.toString() ? G.green : G.border
                    }}>
                    ₹{a.toLocaleString()}
                  </button>
                ))}
              </div>

              <motion.button onClick={nextStep} className="w-full py-5 rounded-2xl font-black text-white text-lg"
                style={{ backgroundColor: G.green }} whileTap={{ scale: 0.98 }}>
                {type === "add" ? "Continue" : "Transfer"}
              </motion.button>
            </div>
          </>
        ) : step === 1 ? (
          <>
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setStep(0)} className="p-2 rounded-xl bg-gray-50"><ChevronRight className="w-5 h-5 rotate-180" /></button>
              <h2 className="font-black text-xl" style={{ color: G.text }}>Pay Via</h2>
            </div>
            <div className="space-y-3">
              {[
                { id: 'upi', label: 'UPI QR / Apps', icon: Smartphone, color: '#FF9900' },
                { id: 'card', label: 'Cards (Visa/Master)', icon: CreditCard, color: '#4A90E2' },
              ].map((m) => (
                <button key={m.id} onClick={() => { setMethod(m.id); setStep(2); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50">
                      <m.icon className="w-6 h-6" style={{ color: m.color }} />
                    </div>
                    <span className="font-bold text-sm" style={{ color: G.text }}>{m.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-30" />
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Step 2: Method Specific UI */
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <button onClick={() => setStep(1)} className="p-2 rounded-xl bg-gray-50"><ChevronRight className="w-5 h-5 rotate-180" /></button>
               <h2 className="font-black text-xl" style={{ color: G.text }}>Checkout</h2>
            </div>

            {method === 'upi' && (
              <div className="text-center py-4">
                <div className="bg-white p-6 rounded-[2.5rem] inline-block mb-6 shadow-2xl shadow-emerald-500/10 border-4 border-emerald-50 relative overflow-hidden group transition-all hover:scale-105">
                   <div className="w-44 h-44 bg-white rounded-2xl flex items-center justify-center relative z-10 p-2 border-2 border-dashed border-emerald-200">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(`upi://pay?pa=8374641439@ybl&pn=StockNova&am=${amount}&cu=INR`)}`}
                        alt="Scan to Pay"
                        className="w-full h-full object-contain"
                      />
                   </div>
                   {/* Decorative corner accents */}
                   <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-xl" />
                   <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-xl" />
                   <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-xl" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-xl" />
                </div>
                
                <div className="mb-8">
                  <p className="text-sm font-black" style={{ color: G.text }}>Scan to Pay ₹{parseFloat(amount).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Smartphone className="w-3 h-3 text-emerald-500" /> Use Any UPI App (GPay, PhonePe, etc.)
                  </p>
                </div>

                <div className="flex justify-center gap-6 mb-8 opacity-60">
                   <div className="w-12 h-6 bg-gray-100 rounded flex items-center justify-center text-[7px] font-black text-gray-400">BHIM</div>
                   <div className="w-12 h-6 bg-gray-100 rounded flex items-center justify-center text-[7px] font-black text-gray-400">GPAY</div>
                   <div className="w-12 h-6 bg-gray-100 rounded flex items-center justify-center text-[7px] font-black text-gray-400">PHONEPE</div>
                </div>

                <motion.button onClick={handle} className="w-full py-5 rounded-2xl font-black text-white text-lg shadow-xl shadow-emerald-500/20"
                  style={{ backgroundColor: G.green }} whileTap={{ scale: 0.98 }}>
                  {busy ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full mx-auto animate-spin" /> : "I've Verified Payment"}
                </motion.button>
              </div>
            )}

            {method === 'card' && (
              <div className="space-y-4">
                 <div className="scale-[0.85] -mx-10 origin-top">
                    <InteractiveCardForm 
                      cardData={cardData} 
                      onUpdate={setCardData} 
                      price={parseFloat(amount)} 
                      onSubmit={handle}
                    />
                 </div>
                 <motion.button onClick={handle} className="w-full py-5 rounded-2xl font-black text-white text-lg"
                  style={{ backgroundColor: G.green }} whileTap={{ scale: 0.98 }}>
                  {busy ? "Processing..." : `Pay ₹${parseFloat(amount).toLocaleString()}`}
                </motion.button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Notifications panel ──────────────────────────────────────────────────────
const notifs = [
  { id: 1, title: "Order Executed", msg: "Bought 50 shares of RELIANCE at ₹2,450", time: "2m ago", dot: G.green },
  { id: 2, title: "Price Alert", msg: "TCS crossed ₹3,900", time: "15m ago", dot: G.red },
  { id: 3, title: "Funds Added", msg: "₹10,000 added to your wallet", time: "1h ago", dot: G.green },
  { id: 4, title: "Market Open", msg: "NSE & BSE are now open", time: "3h ago", dot: G.secondary },
];
function NotifsPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="absolute right-4 top-16 w-80 rounded-2xl shadow-2xl border overflow-hidden"
        style={{ backgroundColor: G.white, borderColor: G.border }}
        initial={{ opacity: 0, y: -12, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12 }}
        onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-4 py-3 border-b" style={{ borderColor: G.border }}>
          <p className="font-bold text-sm" style={{ color: G.text }}>Notifications</p>
          <button onClick={onClose}><X className="w-4 h-4" style={{ color: G.secondary }} /></button>
        </div>
        {notifs.map(n => (
          <div key={n.id} className="flex gap-3 px-4 py-3 border-b hover:bg-gray-50 cursor-pointer" style={{ borderColor: G.border }}>
            <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: n.dot }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: G.text }}>{n.title}</p>
              <p className="text-xs mt-0.5" style={{ color: G.secondary }}>{n.msg}</p>
              <p className="text-xs mt-1" style={{ color: G.muted }}>{n.time}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { id: "discover",  label: "Discover",   icon: Search          },
  { id: "portfolio", label: "Portfolio",  icon: PieChart        },
  { id: "holdings",  label: "Holdings",   icon: Wallet          },
  { id: "orders",    label: "Orders",     icon: History         },
  { id: "funds",     label: "Funds",      icon: CreditCard      },
  { id: "analytics", label: "Analytics",  icon: BarChart3       },
  { id: "settings",  label: "Settings",   icon: Settings        },
];

export default function Dashboard() {
  const [tab, setTab]           = useState("dashboard");
  const [selStock, setSelStock] = useState(fallbackStocks[0]);
  const [time, setTime]         = useState<Date | null>(null);
  const [mounted, setMounted]   = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("traderLevel");
    localStorage.removeItem("user");
    localStorage.removeItem("availableFunds");
    localStorage.removeItem("adminToken");
    window.location.assign("/");
  };
  const [tradeM, setTradeM]     = useState<{ open: boolean; type: "buy"|"sell" }>({ open: false, type: "buy" });
  const [fundsM, setFundsM]     = useState<{ open: boolean; type: "add"|"withdraw" }>({ open: false, type: "add" });
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [trades, setTrades]     = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [stocks, setStocks]     = useState(fallbackStocks);
  const [search, setSearch]     = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [portfolio, setPortfolio] = useState({
    totalValue: 0, dayGain: 0, dayGainPercent: 0,
    gainPercent: 0, availableFunds: 0, totalLimit: 500000,
    traderLevel: "Beginner", expPoints: 0, nextLevelExp: 5000,
  });
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [movers, setMovers] = useState<{ gainers: any[]; losers: any[] }>({ gainers: [], losers: [] });
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [stockDetails, setStockDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      if (!selStock?.symbol) return;
      setLoadingNews(true);
      const res = await getNews(selStock.symbol + ".NS");
      if (res.success) setNews(res.data.slice(0, 4));
      setLoadingNews(false);
    };
    const fetchDetails = async () => {
      if (!selStock?.symbol) return;
      setLoadingDetails(true);
      const res = await getStockDetails(selStock.symbol);
      if (res.success) setStockDetails(res.data);
      setLoadingDetails(false);
    };
    fetchNews();
    fetchDetails();
  }, [selStock]);


  const fetchAll = async () => {
    const storedUser = localStorage.getItem("user");
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    const userId = userObj?.id || userObj?._id;
    const [sRes, pRes, mRes] = await Promise.all([getStocks(), getPortfolio(userId), getMarketMovers()]);
    if (sRes.success && sRes.data?.length) setStocks(sRes.data); else setStocks(fallbackStocks);
    if (mRes.success) setMovers(mRes.data);
    
    // Get portfolio from backend API
    let apiFunds = 0;
    if (pRes.success && pRes.data) {
      apiFunds = pRes.data.availableFunds || 0;
    }
    
    try {
      const storedLevel = localStorage.getItem("traderLevel") || "Beginner";
      const storedFunds = localStorage.getItem("availableFunds");
      // Use API funds if success, otherwise fall back to localStorage
      const funds = pRes.success ? apiFunds : (storedFunds ? parseFloat(storedFunds) : 5000);
      const storedHoldings = localStorage.getItem("userHoldings");
      const savedH = storedHoldings ? JSON.parse(storedHoldings) : [];
      const storedTrades = localStorage.getItem("userTrades");
      const savedT = storedTrades ? JSON.parse(storedTrades) : [];
      
      const cv = savedH.reduce((acc: any, h: any) => acc + h.currentValue, 0);

      setPortfolio(p => ({
        ...p,
        traderLevel: storedLevel,
        availableFunds: funds,
        totalValue: cv,
        ...((pRes.success && pRes.data) ? pRes.data : {})
      }));
      setHoldings(savedH);
      setTrades(savedT);
    } catch { /* if localStorage fails */ }
  };

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      await fetchAll();
      // Keep splash screen for at least 1.5 seconds for premium feel
      setTimeout(() => setLoading(false), 1500);
    };
    init();
    setTime(new Date());
    const t = setInterval(() => setTime(new Date()), 1000);
    
    // Connect to websocket for live stock prices
    const socket = io(process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "http://localhost:5000");

    socket.on('stockUpdates', (updates: any[]) => {
      setStocks(prev => {
        const newStocks = [...prev];
        updates.forEach(upd => {
          const idx = newStocks.findIndex(s => s.symbol === upd.symbol);
          if (idx !== -1) {
            newStocks[idx] = { ...newStocks[idx], ...upd };
          } else {
            newStocks.push(upd);
          }
        });
        return newStocks;
      });
      setSelStock(prev => {
        const match = updates.find(u => u.symbol === prev.symbol);
        return match ? { ...prev, ...match } : prev;
      });
    });

    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    return () => {
      clearInterval(t);
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (search.length < 1) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      const res = await searchStocks(search);
      setSearching(false);
      if (res.success) setSearchResults(res.data);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleTrack = async (stock: any) => {
    const res = await trackStock(stock.symbol);
    if (res.success) {
      setSearch("");
      setSearchResults([]);
      // The socket will push the update, but we can also add it locally to be safe
      const newStock = res.data;
      setStocks(prev => {
        if (prev.find(s => s.symbol === newStock.symbol)) return prev;
        return [...prev, newStock];
      });
      setSelStock(newStock); // Automatically focus and show chart for the new stock
    } else {
      alert("Failed to track stock: " + res.error);
    }
  };

  const handleTrade = async (trade: any) => {
    const total = trade.quantity * trade.price;
    const userId = (user as any)._id || (user as any).id;
    
    // Call API to execute trade in backend
    const apiRes = await executeTrade({
      type: trade.type,
      stock: trade.stock,
      quantity: trade.quantity,
      price: trade.price,
      userId: userId
    });

    const rec = { 
      _id: apiRes.success ? apiRes.data._id : Date.now().toString(), 
      type: trade.type, 
      stock: trade.stock, 
      quantity: trade.quantity, 
      price: trade.price, 
      total, 
      time: "Just now", 
      status: "completed" 
    };
    
    setTrades(p => {
      const nt = [rec, ...p];
      localStorage.setItem("userTrades", JSON.stringify(nt));
      return nt;
    });

    // Use updated balance from API if available, otherwise calculate locally
    let newFunds = apiRes.success && apiRes.updatedBalance !== undefined ? apiRes.updatedBalance : portfolio.availableFunds;
    if (!apiRes.success) {
      if (trade.type === "buy") newFunds -= total;
      else newFunds += total;
    }
    
    localStorage.setItem("availableFunds", newFunds.toString());

    let newH = [...holdings];
    const idx = newH.findIndex(h => h.symbol === trade.stock);
    if (trade.type === "buy") {
      if (idx >= 0) {
        const h = newH[idx];
        const nq = h.quantity + trade.quantity;
        const ni = h.invested + total;
        h.avgPrice = ni / nq;
        h.quantity = nq;
        h.invested = ni;
        h.currentValue = nq * trade.price;
        h.pnl = h.currentValue - h.invested;
        h.pnlPercent = ((h.pnl / h.invested) * 100).toFixed(2);
      } else {
        newH.push({
          symbol: trade.stock, name: trade.name || trade.stock,
          quantity: trade.quantity, avgPrice: trade.price,
          currentPrice: trade.price, invested: total, currentValue: total,
          pnl: 0, pnlPercent: 0
        });
      }
    } else {
      if (idx >= 0) {
        const h = newH[idx];
        const nq = h.quantity - trade.quantity;
        if (nq <= 0) {
          newH.splice(idx, 1);
        } else {
          h.quantity = nq;
          h.invested = h.avgPrice * nq;
          h.currentValue = nq * trade.price;
          h.pnl = h.currentValue - h.invested;
          h.pnlPercent = ((h.pnl / h.invested) * 100).toFixed(2);
        }
      }
    }
    
    setHoldings(newH);
    localStorage.setItem("userHoldings", JSON.stringify(newH));

    const newCv = newH.reduce((acc: any, h: any) => acc + h.currentValue, 0);
    setPortfolio(p => ({
      ...p,
      availableFunds: newFunds,
      totalValue: newCv
    }));
  };

  const handleFunds = async (type: "add"|"withdraw", amount: number, upiId: string = "") => {
    try { 
      const userId = (user as any)._id || (user as any).id;
      let apiRes;
      
      if (type === "add") {
        apiRes = await addFunds(amount, userId);
      } else {
        if (amount > portfolio.availableFunds) return alert("Insufficient funds");
        apiRes = await withdrawFunds(amount, userId, upiId);
      }

      // Sync balance with backend
      const newF = (apiRes.success && apiRes.updatedBalance !== undefined) 
        ? apiRes.updatedBalance 
        : (type === "add" ? portfolio.availableFunds + amount : portfolio.availableFunds - amount);
      
      const currentCv = holdings.reduce((acc: any, h: any) => acc + h.currentValue, 0);
      setPortfolio(p => ({ 
        ...p, 
        availableFunds: newF,
        totalValue: currentCv 
      }));
      localStorage.setItem("availableFunds", newF.toString());
    } catch (error) {
      console.error("Funds operation failed:", error);
    }
  };

  const handleRefresh = async () => { setRefreshing(true); await fetchAll(); await new Promise(r => setTimeout(r, 700)); setRefreshing(false); };

  const filtered = stocks.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: G.bg }}>
      <AnimatePresence>
        {loading && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl relative z-10" style={{ backgroundColor: G.green }}>
                <span className="text-white font-black text-4xl">S</span>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-[#00D09C] rounded-full blur-3xl -z-10" 
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-center"
            >
              <h1 className="text-3xl font-black tracking-tight" style={{ color: G.text }}>
                Stock<span style={{ color: G.green }}>Nova</span>
              </h1>
              <p className="text-xs font-bold uppercase tracking-[0.3em] mt-2 opacity-40 ml-1">Secure Trading Terminal</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {tradeM.open && <TradeModal isOpen={tradeM.open} onClose={() => setTradeM({ ...tradeM, open: false })} type={tradeM.type} stock={selStock} onTrade={handleTrade} portfolio={portfolio} holdings={holdings} />}
        {fundsM.open && <FundsModal isOpen={fundsM.open} onClose={() => setFundsM({ ...fundsM, open: false })} type={fundsM.type} onComplete={(a: number, u: string) => handleFunds(fundsM.type, a, u)} limit={portfolio.totalLimit} />}
        {notifsOpen && <NotifsPanel onClose={() => setNotifsOpen(false)} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-40 border-b" style={{ backgroundColor: G.white, borderColor: G.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <button onClick={() => setTab("portfolio")} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: G.green }}>
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="font-bold text-base hidden sm:block" style={{ color: G.text }}>
                  Stock<span style={{ color: G.green }}>Nova</span>
                </span>
              </button>
              
              {/* Landing page links integrated into dashboard */}
              <div className="hidden lg:flex items-center gap-6 ml-4">
                {[
                  { name: "Features", href: "/#features" },
                  { name: "Pricing", href: "/#pricing" },
                  { name: "Tools", href: "/#tools" },
                  { name: "Testimonials", href: "/#testimonials" },
                ].map((link) => (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    className="text-xs font-semibold hover:text-[#00D09C] transition-colors"
                    style={{ color: G.secondary }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="hidden xl:block">
                <BouncyClock size="mini" />
              </div>
            </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <AnimatedSearch 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                onFocus={() => { if (tab !== "discover") setTab("dashboard"); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchResults.length > 0) {
                    handleTrack(searchResults[0]);
                  }
                }}
                placeholder="Search Stocks..."
              />
              
              {/* Search Results Dropdown */}
              <AnimatePresence>
                {search.length >= 1 && (searchResults.length > 0 || searching) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl border overflow-hidden z-50 max-h-[400px] overflow-y-auto"
                    style={{ backgroundColor: G.white, borderColor: G.border }}
                  >
                    {searching ? (
                      <div className="p-4 text-center text-xs text-gray-400">Searching...</div>
                    ) : (
                      searchResults.map((s: any, idx: number) => (
                        <div 
                          key={s.symbol || idx} 
                          className="flex items-center justify-between px-4 py-3 border-b hover:bg-gray-50 cursor-pointer group"
                          style={{ borderColor: G.border }}
                          onClick={() => handleTrack(s)}
                        >
                          <div>
                            <p className="text-sm font-bold" style={{ color: G.text }}>{s.symbol}</p>
                            <p className="text-[10px] truncate max-w-[120px]" style={{ color: G.secondary }}>{s.shortname || s.longname || s.symbol}</p>
                          </div>
                          <button 
                            className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundColor: G.greenLight, color: G.green }}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                    {searchResults.length === 0 && !searching && (
                      <div className="p-4 text-center text-xs text-gray-400">No results found</div>
                    ) }
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="relative p-2 rounded-xl" style={{ color: G.secondary }} onClick={() => setNotifsOpen(!notifsOpen)}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: G.red }} />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase" style={{ backgroundColor: G.green }}>{user.name.charAt(0)}</div>
              </button>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 top-10 w-44 rounded-2xl shadow-xl border overflow-hidden z-50"
                  style={{ backgroundColor: G.white, borderColor: G.border }}>
                  <div className="px-4 py-3 border-b" style={{ borderColor: G.border }}>
                    <p className="text-sm font-bold" style={{ color: G.text }}>{user.name}</p>
                    <p className="text-xs" style={{ color: G.muted }}>{user.email}</p>
                  </div>
                  <button onClick={() => { setTab("settings"); setProfileOpen(false); }} className="w-full px-4 py-2.5 text-left flex items-center gap-2 text-sm hover:bg-gray-50" style={{ color: G.text }}>
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="border-t pt-2 pb-2 px-2 flex justify-center" style={{ borderColor: G.border }}>
                    <AnimatedLogout onLogout={handleLogout} />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-1 w-48 flex-shrink-0">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setTab(item.id)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left"
                style={{
                  backgroundColor: tab === item.id ? G.greenLight : "transparent",
                  color: tab === item.id ? G.green : G.secondary,
                }}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {item.label}
              </button>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-center" style={{ borderColor: G.border }}>
               <AnimatedLogout onLogout={handleLogout} />
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="flex-1 min-w-0 space-y-4">

            {/* Mobile tab row */}
            <div className="lg:hidden mb-4">
              <SparkleNavbar 
                items={navItems}
                activeId={tab}
                onTabChange={setTab}
                color={G.green}
              />
            </div>

            {/* ══ DASHBOARD / PORTFOLIO TAB ══════════════════════════════════════════════════ */}
            {(tab === "dashboard" || tab === "portfolio") && (
              <>
                {/* Portfolio value card - PREMIUM GRADIENT */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2.5rem] p-8 shadow-xl shadow-emerald-500/10 border relative overflow-hidden text-white" 
                  style={{ 
                    background: `linear-gradient(135deg, ${G.green} 0%, #009D76 100%)`,
                    borderColor: "rgba(255,255,255,0.1)" 
                  }}>
                  {/* Decorative glass circles */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 opacity-20 rounded-full -ml-24 -mb-24 blur-3xl pointer-events-none" />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div>
                      <div className="flex items-center gap-2 opacity-80 mb-1">
                        <Wallet className="w-4 h-4" />
                        <p className="text-sm font-bold uppercase tracking-wider">Available Balance</p>
                      </div>
                      <p className="text-5xl font-black">₹{(portfolio.availableFunds ?? 0).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex gap-3">
                      <motion.button onClick={() => setFundsM({ open: true, type: "add" })}
                        className="px-6 py-3 rounded-2xl font-bold text-sm bg-white text-emerald-700 shadow-lg"
                        whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        + Add Funds
                      </motion.button>
                      <motion.button onClick={() => setFundsM({ open: true, type: "withdraw" })}
                        className="px-6 py-3 rounded-2xl font-bold text-sm border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                        Withdraw
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/10">
                    {[
                      { label: "Holdings Value", val: fmt(portfolio.totalValue) },
                      { label: "Invested",        val: fmt(holdings.reduce((acc: any, h: any) => acc + h.invested, 0)) },
                      { label: "Total Returns",   val: (holdings.reduce((acc: any, h: any) => acc + h.pnl, 0) >= 0 ? "+" : "") + fmt(holdings.reduce((acc: any, h: any) => acc + h.pnl, 0)), highlight: true },
                      { label: "Trader Level",    val: portfolio.traderLevel },
                    ].map(({ label, val, highlight }) => (
                      <div key={label}>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">{label}</p>
                        <p className={`text-lg font-black mt-1 ${highlight ? "text-emerald-300" : "text-white"}`}>{val}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Market movers + Trade panel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Watchlist */}
                  <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-2xl border overflow-hidden" style={{ backgroundColor: G.white, borderColor: G.border }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: G.border }}>
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" style={{ color: G.green }} />
                        <p className="font-bold text-sm" style={{ color: G.text }}>My Watchlist</p>
                      </div>
                      <button onClick={handleRefresh}><RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} style={{ color: G.muted }} /></button>
                    </div>
                    {filtered.map((s, i) => (
                      <motion.div key={s.symbol} onClick={() => setSelStock(s)}
                        className="w-full flex items-center justify-between px-4 py-3 border-b text-left transition-colors cursor-pointer group"
                        style={{ borderColor: G.border, backgroundColor: selStock.symbol === s.symbol ? G.greenLight : "transparent" }}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                            style={{ backgroundColor: s.change >= 0 ? G.greenLight : G.redLight, color: s.change >= 0 ? G.green : G.red }}>
                            {s.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <p className="text-sm font-bold" style={{ color: G.text }}>{s.symbol}</p>
                            <p className="text-xs" style={{ color: G.muted }}>{s.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: G.text }}>₹{s.price.toFixed(2)}</p>
                            <p className="text-xs font-semibold" style={{ color: s.change >= 0 ? G.green : G.red }}>
                              {s.change >= 0 ? "+" : ""}{s.change}%
                            </p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setStocks(prev => prev.filter(st => st.symbol !== s.symbol)); }}
                            className="p-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                          >
                             <X className="w-3 h-3 text-red-400" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Selected stock + trade */}
                  <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                    className="rounded-2xl border p-5" style={{ backgroundColor: G.white, borderColor: G.border }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl font-bold text-sm flex items-center justify-center"
                          style={{ backgroundColor: selStock.change >= 0 ? G.greenLight : G.redLight, color: selStock.change >= 0 ? G.green : G.red }}>
                          {selStock.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: G.text }}>{selStock.symbol}</p>
                          <p className="text-xs" style={{ color: G.muted }}>{selStock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: G.text }}>₹{selStock.price.toFixed(2)}</p>
                        <p className="text-xs font-semibold" style={{ color: selStock.change >= 0 ? G.green : G.red }}>
                          {selStock.change >= 0 ? "+" : ""}{selStock.change}% today
                        </p>
                      </div>
                    </div>

                    {/* Groww-style Live Chart */}
                    <LiveChart key={selStock.symbol} stock={selStock} />

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                      {[
                        ["Volume", selStock.volume], 
                        ["High", `₹${selStock.high || (selStock.price * 1.02).toFixed(2)}`], 
                        ["Low", `₹${selStock.low || (selStock.price * 0.98).toFixed(2)}`],
                        ["Market Cap", stockDetails ? (stockDetails.marketCap > 10000000 ? `${(stockDetails.marketCap/10000000).toFixed(1)}Cr` : stockDetails.marketCap) : "---"]
                      ].map(([l, v]) => (
                        <div key={l} className="text-center p-2 rounded-xl" style={{ backgroundColor: G.bg }}>
                          <p className="text-[10px] uppercase font-bold tracking-wider opacity-40 text-gray-500">{l}</p>
                          <p className="text-xs font-black mt-0.5" style={{ color: G.text }}>{v}</p>
                        </div>
                      ))}
                    </div>

                    {loadingDetails ? (
                      <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-2xl border border-dashed border-gray-200 animate-pulse">
                         <div className="h-8 bg-gray-50 rounded-lg"></div>
                         <div className="h-8 bg-gray-50 rounded-lg"></div>
                      </div>
                    ) : stockDetails ? (
                      <div className="grid grid-cols-2 gap-2 mb-4 p-3 rounded-2xl border border-dashed border-gray-200">
                         <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase">52W Range</p>
                            <p className="text-[10px] font-black mt-1" style={{ color: G.text }}>
                               ₹{stockDetails.fiftyTwoWeekLow?.toFixed(2)} - ₹{stockDetails.fiftyTwoWeekHigh?.toFixed(2)}
                            </p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">P/E Ratio</p>
                            <p className="text-[10px] font-black mt-1" style={{ color: G.text }}>
                               {stockDetails.peRatio?.toFixed(2) || "N/A"}
                            </p>
                         </div>
                      </div>
                    ) : null}

                    <div className="flex gap-3 mb-6">
                      <motion.button onClick={() => setTradeM({ open: true, type: "buy" })}
                        className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                        style={{ backgroundColor: G.green }} whileTap={{ scale: 0.97 }}>Buy</motion.button>
                      <motion.button onClick={() => setTradeM({ open: true, type: "sell" })}
                        className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                        style={{ backgroundColor: G.red }} whileTap={{ scale: 0.97 }}>Sell</motion.button>
                    </div>

                    <div className="pt-4 border-t" style={{ borderColor: G.border }}>
                      <p className="font-bold text-sm mb-4" style={{ color: G.text }}>Recent News for {selStock.symbol}</p>
                      {loadingNews ? (
                        <div className="space-y-3">
                          {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-gray-50 animate-pulse" />)}
                        </div>
                      ) : news.length > 0 ? (
                        <div className="space-y-4">
                          {news.map((item, idx) => (
                            <a key={idx} href={item.link} target="_blank" rel="noreferrer" className="block group">
                              <p className="text-xs font-bold leading-snug group-hover:text-[#00D09C] transition-colors line-clamp-2" style={{ color: G.text }}>
                                {item.title}
                              </p>
                              <p className="text-[10px] mt-1" style={{ color: G.muted }}>
                                {item.publisher} · {new Date(item.providerPublishTime * 1000).toLocaleDateString()}
                              </p>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-center py-4" style={{ color: G.muted }}>No recent news found for this stock.</p>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Discovery Section - Real-time market data from other "website references" (APIs) */}
                <div className="flex items-center justify-between mb-2 mt-4">
                   <p className="font-bold text-sm" style={{ color: G.text }}>Market Discovery</p>
                   <button onClick={() => setTab("discover")} className="text-xs font-bold" style={{ color: G.green }}>See All</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Top Gainers", data: movers.gainers.slice(0, 5), color: G.green },
                    { title: "Top Losers", data: movers.losers.slice(0, 5), color: G.red }
                  ].map((group) => (
                    <motion.div key={group.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border p-5" style={{ backgroundColor: G.white, borderColor: G.border }}>
                      <p className="font-bold text-xs mb-4 opacity-50 uppercase tracking-widest" style={{ color: G.text }}>{group.title}</p>
                      <div className="space-y-4">
                        {group.data.map((item: any) => (
                          <div key={item.symbol} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]"
                                style={{ backgroundColor: group.color + '15', color: group.color }}>
                                {item.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: G.text }}>{item.symbol}</p>
                                <p className="text-[10px] truncate max-w-[100px]" style={{ color: G.muted }}>{item.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-bold" style={{ color: G.text }}>₹{item.price?.toFixed(2)}</p>
                                <p className="text-[10px] font-bold" style={{ color: group.color }}>
                                  {item.change >= 0 ? "+" : ""}{item.change?.toFixed(2)}%
                                </p>
                              </div>
                              <button 
                                onClick={() => handleTrack({ symbol: item.fullSymbol || (item.symbol + '.NS') })}
                                className="p-2 rounded-lg bg-gray-50 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Plus className="w-3 h-3" style={{ color: G.green }} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Trades */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="rounded-2xl border overflow-hidden" style={{ backgroundColor: G.white, borderColor: G.border }}>
                  <div className="flex justify-between items-center px-5 py-3 border-b" style={{ borderColor: G.border }}>
                    <p className="font-bold text-sm" style={{ color: G.text }}>Recent Trades</p>
                    <button className="flex items-center gap-1 text-xs font-semibold" style={{ color: G.green }}>
                      View All <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  {trades.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm" style={{ color: G.muted }}>No trades yet. Start trading above!</p>
                  ) : (
                    <div className="divide-y" style={{ borderColor: G.border }}>
                      {trades.slice(0, 5).map((t, i) => (
                        <div key={t._id ?? i} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ backgroundColor: t.type === "buy" ? G.greenLight : G.redLight, color: t.type === "buy" ? G.green : G.red }}>
                              {(t.type || "").toUpperCase()}
                            </span>
                            <div>
                              <p className="text-sm font-bold" style={{ color: G.text }}>{t.stock}</p>
                              <p className="text-xs" style={{ color: G.muted }}>{t.quantity} shares · ₹{safeFixed(t.price)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold" style={{ color: G.text }}>₹{(t.total ?? 0).toLocaleString("en-IN")}</p>
                            <p className="text-xs" style={{ color: G.muted }}>{t.time ?? "N/A"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </>
            )}

            {/* ══ DISCOVER TAB ══════════════════════════════════════════════════ */}
            {tab === "discover" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black" style={{ color: G.text }}>Market Discovery</h2>
                    <p className="text-sm" style={{ color: G.secondary }}>Explore trending stocks and hidden gems across 5,000+ NSE equities</p>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                     {["NIFTY 50", "NEXT 50", "MIDCAP", "SMALLCAP", "IT", "PHARMA", "BANKS"].map(cat => (
                       <button key={cat} className="px-4 py-2 rounded-xl text-[10px] font-black border transition-all hover:border-[#00D09C] hover:bg-white flex-shrink-0" 
                        style={{ borderColor: G.border, color: G.secondary, backgroundColor: G.bg }}>{cat}</button>
                     ))}
                  </div>
                </div>

                {/* Search Suggestion Card */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-[2.5rem] p-8 border relative overflow-hidden text-white"
                  style={{ background: `linear-gradient(135deg, #121212 0%, #2A2A2A 100%)` }}>
                    <div className="relative z-10">
                      <p className="text-xs font-black text-[#00D09C] mb-3 uppercase tracking-[0.4em]">Infinity Engine 2.0</p>
                      <p className="text-3xl font-black mb-4 tracking-tighter">Instant access to 5,000+ equities.</p>
                      <p className="text-sm opacity-60 max-w-lg mb-8 leading-relaxed font-medium">
                        StockNova's discovery engine is synced with real-time market repositories. Search for any NSE or BSE listed scrip to start tracking immediately with ultra-low latency.
                      </p>
                      
                      <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mr-2">Trending:</span>
                        {["RELIANCE", "TATASTEEL", "ZOMATO", "HDFCBANK"].map(s => (
                          <button key={s} onClick={() => setSearch(s)} 
                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold hover:bg-white/10 transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="absolute right-[-5%] bottom-[-20%] opacity-5 rotate-12">
                       <Search className="w-96 h-96" strokeWidth={1} />
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: "Top Daily Gainers", data: movers.gainers, color: G.green, icon: TrendingUp },
                    { title: "Top Daily Losers",  data: movers.losers,  color: G.red,   icon: TrendingDown }
                  ].map((group) => (
                    <motion.div key={group.title} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                      className="rounded-[2rem] border p-6" style={{ backgroundColor: G.white, borderColor: G.border }}>
                      <div className="flex items-center justify-between mb-6 border-b pb-4" style={{ borderColor: G.bg }}>
                        <div className="flex items-center gap-3">
                           <div className="p-2 rounded-xl" style={{ backgroundColor: group.color + '15' }}>
                              <group.icon className="w-5 h-5" style={{ color: group.color }} />
                           </div>
                           <p className="font-black text-sm uppercase tracking-wider" style={{ color: G.text }}>{group.title}</p>
                        </div>
                        <span className="text-[10px] font-bold opacity-30 tracking-widest uppercase">NSE | LIVE</span>
                      </div>
                      <div className="space-y-1">
                        {group.data.map((item: any, idx: number) => (
                          <div key={item.symbol} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => handleTrack({ symbol: item.fullSymbol || item.symbol + ".NS" })}>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-black opacity-10 w-4">{idx + 1}</span>
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[11px]"
                                style={{ backgroundColor: group.color + '15', color: group.color }}>
                                {item.symbol.slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: G.text }}>{item.symbol}</p>
                                <p className="text-[10px] truncate max-w-[120px]" style={{ color: G.muted }}>{item.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-sm font-black" style={{ color: G.text }}>₹{item.price?.toFixed(2)}</p>
                                <p className="text-[10px] font-black" style={{ color: group.color }}>
                                  {item.change >= 0 ? "+" : ""}{item.change?.toFixed(2)}%
                                </p>
                              </div>
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center border bg-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <Plus className="w-4 h-4" style={{ color: G.green }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ══ HOLDINGS TAB ═══════════════════════════════════════════════════ */}
            {tab === "holdings" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border overflow-hidden" style={{ backgroundColor: G.white, borderColor: G.border }}>
                <div className="p-5 border-b" style={{ borderColor: G.border }}>
                  <p className="font-bold text-base mb-4" style={{ color: G.text }}>Your Holdings</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { l: "Invested",      v: fmt(holdings.reduce((acc: any, h: any) => acc + h.invested, 0)), g: false },
                      { l: "Current Value", v: fmt(holdings.reduce((acc: any, h: any) => acc + h.currentValue, 0)), g: false },
                      { l: "Total P&L",     v: (holdings.reduce((acc: any, h: any) => acc + h.pnl, 0) >= 0 ? "+" : "") + fmt(holdings.reduce((acc: any, h: any) => acc + h.pnl, 0)),  g: holdings.reduce((acc: any, h: any) => acc + h.pnl, 0) >= 0  },
                      { l: "Returns",       v: (holdings.reduce((acc: any, h: any) => acc + h.invested, 0) ? ((holdings.reduce((acc: any, h: any) => acc + h.pnl, 0) / holdings.reduce((acc: any, h: any) => acc + h.invested, 0)) * 100).toFixed(2) : "0.00") + "%",    g: holdings.reduce((acc: any, h: any) => acc + h.pnl, 0) >= 0  },
                    ].map(({ l, v, g }) => (
                      <div key={l} className="p-3 rounded-xl" style={{ backgroundColor: g ? G.greenLight : G.bg }}>
                        <p className="text-xs" style={{ color: G.muted }}>{l}</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: g ? G.green : G.text }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: G.border }}>
                  {holdings.map((h: any, i: number) => (
                    <motion.div key={h.symbol} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
                          style={{ backgroundColor: h.pnl >= 0 ? G.greenLight : G.redLight, color: h.pnl >= 0 ? G.green : G.red }}>
                          {h.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: G.text }}>{h.symbol}</p>
                          <p className="text-xs" style={{ color: G.muted }}>{h.quantity} shares · Avg ₹{h.avgPrice.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: G.text }}>₹{h.currentValue.toLocaleString("en-IN")}</p>
                        <p className="text-xs font-semibold" style={{ color: h.pnl >= 0 ? G.green : G.red }}>
                          {h.pnl >= 0 ? "+" : ""}₹{Math.abs(h.pnl).toLocaleString("en-IN")} ({h.pnlPercent}%)
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ ORDERS TAB ═════════════════════════════════════════════════════ */}
            {tab === "orders" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border overflow-hidden" style={{ backgroundColor: G.white, borderColor: G.border }}>
                <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: G.border }}>
                  <p className="font-bold text-base" style={{ color: G.text }}>Order History</p>
                  <button className="flex items-center gap-1 text-xs font-semibold" style={{ color: G.green }}>
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>
                <div className="flex gap-2 px-5 py-3 border-b overflow-x-auto" style={{ borderColor: G.border }}>
                  {["All", "Executed", "Pending", "Cancelled"].map((f, i) => (
                    <button key={f} className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: i === 0 ? G.green : G.bg, color: i === 0 ? G.white : G.secondary }}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className="divide-y" style={{ borderColor: G.border }}>
                  {[...trades, { _id: "000789", stock: "INFY", type: "buy", quantity: 30, price: 1775.5, total: 53265, status: "pending", time: "Today, 10:30 AM" }].map((t, i) => (
                    <div key={t._id ?? i} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{ backgroundColor: t.type === "buy" ? G.greenLight : G.redLight, color: t.type === "buy" ? G.green : G.red }}>
                          {(t.type || "").toUpperCase()}
                        </span>
                        <div>
                          <p className="text-sm font-bold" style={{ color: G.text }}>{t.stock}</p>
                          <p className="text-xs" style={{ color: G.muted }}>{t.quantity} shares · ₹{safeFixed(t.price)} · {t.time ?? "N/A"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold" style={{ color: G.text }}>₹{(t.total ?? 0).toLocaleString()}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: (t.status ?? "completed") === "completed" ? G.greenLight : "#FFF8E5", color: (t.status ?? "completed") === "completed" ? G.green : "#D4A017" }}>
                          {(t.status ?? "COMPLETED").toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ FUNDS TAB ══════════════════════════════════════════════════════ */}
            {tab === "funds" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Available Balance", val: fmt(portfolio.availableFunds), action: () => setFundsM({ open: true, type: "add" }), btnLabel: "+ Add Funds", primary: true },
                    { label: "Used Margin", val: fmt((portfolio.totalLimit ?? 500000) - (portfolio.availableFunds ?? 150000)), action: null, btnLabel: null, primary: false },
                    { label: "Withdrawable", val: fmt(portfolio.availableFunds), action: () => setFundsM({ open: true, type: "withdraw" }), btnLabel: "Withdraw", primary: false },
                  ].map(({ label, val, action, btnLabel, primary }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="rounded-2xl border p-5" style={{ backgroundColor: G.white, borderColor: G.border }}>
                      <p className="text-xs font-medium mb-1" style={{ color: G.muted }}>{label}</p>
                      <p className="text-2xl font-bold" style={{ color: G.text }}>{val}</p>
                      {action && (
                        <motion.button onClick={action} className="mt-4 w-full py-2.5 rounded-xl font-semibold text-sm"
                          style={{ backgroundColor: primary ? G.green : G.bg, color: primary ? G.white : G.secondary }}
                          whileTap={{ scale: 0.97 }}>
                          {btnLabel}
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="rounded-2xl border overflow-hidden" style={{ backgroundColor: G.white, borderColor: G.border }}>
                  <p className="font-bold text-sm px-5 py-4 border-b" style={{ color: G.text, borderColor: G.border }}>Recent Transactions</p>
                  {[{ type: "deposit", amount: 50000, date: "18 Mar 2026" }, { type: "withdrawal", amount: 25000, date: "15 Mar 2026" }, { type: "deposit", amount: 100000, date: "10 Mar 2026" }].map((tx, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-4 border-b hover:bg-gray-50" style={{ borderColor: G.border }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: tx.type === "deposit" ? G.greenLight : G.redLight }}>
                          {tx.type === "deposit" ? <ArrowDownRight className="w-4 h-4" style={{ color: G.green }} /> : <ArrowUpRight className="w-4 h-4" style={{ color: G.red }} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold" style={{ color: G.text }}>{tx.type === "deposit" ? "Deposit" : "Withdrawal"}</p>
                          <p className="text-xs" style={{ color: G.muted }}>{tx.date}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm" style={{ color: tx.type === "deposit" ? G.green : G.red }}>
                        {tx.type === "deposit" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </motion.div>
              </>
            )}

            {/* ══ ANALYTICS TAB ══════════════════════════════════════════════════ */}
            {tab === "analytics" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "Portfolio Allocation", items: [{ label: "Large Cap", val: 45, color: G.green }, { label: "Mid Cap", val: 30, color: "#7B5EA7" }, { label: "Small Cap", val: 15, color: "#00A87D" }, { label: "Cash", val: 10, color: G.muted }] },
                    { title: "Sector Allocation",    items: [{ label: "Banking", val: 25, color: G.green }, { label: "IT", val: 20, color: "#7B5EA7" }, { label: "Energy", val: 18, color: "#00A87D" }, { label: "Pharma", val: 12, color: "#D4A017" }, { label: "Others", val: 25, color: G.muted }] },
                  ].map(({ title, items }) => (
                    <motion.div key={title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border p-5" style={{ backgroundColor: G.white, borderColor: G.border }}>
                      <p className="font-bold text-sm mb-4" style={{ color: G.text }}>{title}</p>
                      <div className="space-y-3">
                        {items.map(({ label, val, color }) => (
                          <div key={label}>
                            <div className="flex justify-between mb-1">
                              <span className="text-xs font-medium" style={{ color: G.secondary }}>{label}</span>
                              <span className="text-xs font-bold" style={{ color: G.text }}>{val}%</span>
                            </div>
                            <div className="w-full rounded-full h-2" style={{ backgroundColor: G.bg }}>
                              <motion.div className="h-2 rounded-full" style={{ backgroundColor: color }}
                                initial={{ width: 0 }} animate={{ width: `${val}%` }} transition={{ duration: 0.7, delay: 0.2 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="rounded-2xl border p-5" style={{ backgroundColor: G.white, borderColor: G.border }}>
                  <p className="font-bold text-sm mb-4" style={{ color: G.text }}>Performance Returns</p>
                  <div className="grid grid-cols-4 gap-3">
                    {[["1M", "+5.2%"], ["3M", "+12.8%"], ["6M", "+18.5%"], ["1Y", "+32.4%"]].map(([period, ret]) => (
                      <div key={period} className="text-center p-3 rounded-xl" style={{ backgroundColor: G.greenLight }}>
                        <p className="text-xs font-medium" style={{ color: G.secondary }}>{period}</p>
                        <p className="text-base font-bold mt-1" style={{ color: G.green }}>{ret}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* ══ SETTINGS TAB ═══════════════════════════════════════════════════ */}
            {tab === "settings" && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border p-6 space-y-6" style={{ backgroundColor: G.white, borderColor: G.border }}>
                <p className="font-bold text-xl" style={{ color: G.text }}>Settings</p>

                {/* Profile */}
                <div className="pb-6 border-b" style={{ borderColor: G.border }}>
                  <p className="font-semibold text-sm flex items-center gap-2 mb-4" style={{ color: G.text }}><User className="w-4 h-4" /> Profile Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[["Full Name", "text", "User"], ["Email", "email", "user@example.com"], ["Phone", "tel", "+91 98765 43210"], ["PAN", "text", "ABCDE1234F"]].map(([l, t, v]) => (
                      <div key={String(l)}>
                        <label className="block text-xs font-medium mb-1" style={{ color: G.secondary }}>{l}</label>
                        <input type={String(t)} defaultValue={String(v)} className="w-full px-4 py-2.5 rounded-xl border focus:outline-none text-sm"
                          style={{ borderColor: G.border, color: G.text, backgroundColor: G.bg }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="pb-6 border-b" style={{ borderColor: G.border }}>
                  <p className="font-semibold text-sm flex items-center gap-2 mb-4" style={{ color: G.text }}><Bell className="w-4 h-4" /> Notifications</p>
                  <div className="space-y-3">
                    {[["Order Executions", true], ["Price Alerts", true], ["Market News", false], ["Daily Summary", true]].map(([label, on]) => (
                      <div key={String(label)} className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: G.text }}>{label as string}</span>
                        <GToggle checked={on as boolean} onChange={() => {}} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div>
                  <p className="font-semibold text-sm flex items-center gap-2 mb-4" style={{ color: G.text }}><Shield className="w-4 h-4" /> Security</p>
                  <div className="space-y-2">
                    {[["Change Password", null], ["2FA Authentication", "Enabled"], ["Login History", null]].map(([l, badge]) => (
                      <button key={String(l)} className="w-full flex items-center justify-between p-4 rounded-xl border text-sm"
                        style={{ borderColor: G.border, color: G.text, backgroundColor: G.bg }}>
                        <span>{l as string}</span>
                        {badge ? <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: G.greenLight, color: G.green }}>{badge}</span>
                          : <ChevronRight className="w-4 h-4" style={{ color: G.muted }} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <motion.button className="flex-1 py-3 rounded-xl font-bold text-white text-sm" style={{ backgroundColor: G.green }} whileTap={{ scale: 0.97 }}>Save Changes</motion.button>
                  <motion.button className="flex-1 py-3 rounded-xl font-bold text-sm" style={{ backgroundColor: G.bg, color: G.secondary }} whileTap={{ scale: 0.97 }}>Cancel</motion.button>
                </div>
              </motion.div>
            )}

          </main>
        </div>
      </div>
    </motion.div>
  </div>
);
}
