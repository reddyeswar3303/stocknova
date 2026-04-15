"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Bell, PieChart, Activity, PlusCircle, CheckCircle, AlignLeft, Settings, ShieldAlert, Cpu, ChevronDown, Globe } from "lucide-react";
import Link from "next/link";

export default function TradenDashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#070b19] flex font-sans text-white overflow-hidden selection:bg-purple-500/30">
      
      {/* ── SIDEBAR ── */}
      <aside className="w-[100px] sm:w-[220px] flex flex-col justify-between items-start border-r border-indigo-500/10 bg-[#0a0f25]/50 backdrop-blur-3xl p-5 xl:p-8 flex-shrink-0 transition-all rounded-r-[40px] shadow-[10px_0_50px_rgba(0,0,0,0.5)] z-20">
        
        <div className="w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 ml-2">
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-[#ec4899] to-[#8b5cf6] rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <span className="hidden sm:block text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">
              Traden
            </span>
          </div>

          {/* Balance Indicator */}
          <div className="mb-10 pl-2">
             <div className="text-[42px] font-bold leading-none tracking-tight">6.108</div>
             <div className="w-12 h-1 bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] mt-4 rounded-full" />
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-3 w-full">
            {[
              { label: "Dashboard",   icon: PieChart,    active: false },
              { label: "Market data", icon: Activity,    active: false },
              { label: "Watchlist",   icon: AlignLeft,   active: true }, // The active one
              { label: "Copy Traders",icon: Cpu,         active: false, badge: true },
              { label: "Checklists",  icon: CheckCircle, active: false },
            ].map((item, idx) => (
              <button key={idx} className={`w-full flex items-center justify-start gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-semibold text-[13px] ${
                item.active 
                  ? "bg-gradient-to-r from-[#171a3d] to-[#12163b] text-white shadow-[inset_0_0_20px_rgba(139,92,246,0.1)] border border-indigo-500/20" 
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}>
                <item.icon className={`w-[18px] h-[18px] ${item.active ? "text-indigo-400" : ""}`} />
                <span className="hidden sm:block">{item.label}</span>
                {item.badge && <span className="hidden sm:block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] ml-auto" />}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile bottom */}
        <div className="w-full flex items-center gap-3 pl-2 mt-10">
           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-400 flex items-center justify-center font-bold text-sm shadow-[0_0_15px_rgba(236,72,153,0.3)]">
             U
           </div>
           <div className="hidden sm:block text-xs">
             <div className="font-bold text-gray-200">User Acc.</div>
             <div className="text-gray-500">Premium</div>
           </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col min-w-0 px-6 xl:px-8 py-6 max-h-screen overflow-y-auto">
        
        {/* Top Header section */}
        <header className="flex items-center justify-between mb-8 w-full">
          {/* Search bar */}
          <div className="flex-1 max-w-lg relative">
             <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20 rounded-full blur-md opacity-50" />
             <div className="relative flex items-center bg-[#131633] backdrop-blur-xl border border-indigo-500/20 rounded-full px-5 py-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
               <Search className="w-4 h-4 text-indigo-400 mr-3" />
               <input 
                 type="text" 
                 placeholder="Search assets..." 
                 className="bg-transparent border-none outline-none text-sm text-gray-200 w-full placeholder-indigo-300/40"
               />
               <Search className="w-4 h-4 text-indigo-400 opacity-0" /> {/* spacing balancer */}
             </div>
          </div>
          
          {/* Right Header Controls */}
          <div className="flex items-center gap-5 ml-6">
             <button className="text-gray-400 hover:text-white transition-colors">
               <Globe className="w-5 h-5" />
             </button>
             <button className="text-gray-400 hover:text-white transition-colors relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,1)]" />
             </button>
             <button className="bg-gradient-to-r from-[#4f46e5] to-[#7e22ce] text-white text-xs font-bold px-6 py-3 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">
               Connect Wallet
             </button>
          </div>
        </header>

        {/* Dashboard Grid layout */}
        <div className="flex-1 flex flex-col xl:flex-row gap-6 h-full pb-4">
          
          {/* Main Left/Center Column */}
          <div className="flex-1 flex flex-col gap-6 w-full xl:w-8/12">
            
            {/* Top Stat Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Large purple glowing card */}
               <div className="md:col-span-2 relative p-[1px] rounded-[30px] bg-gradient-to-r from-[#bf27f5] via-[#4b4dff] to-[#ec4899] shadow-[0_0_40px_rgba(110,65,255,0.2)]">
                  <div className="absolute inset-0 blur-[20px] bg-gradient-to-r from-[#bf27f5]/40 via-[#4b4dff]/40 to-[#ec4899]/40 rounded-[30px] -z-10" />
                  <div className="h-full bg-[#0d122b]/90 backdrop-blur-3xl rounded-[30px] p-6 flex flex-col justify-between">
                     <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[34px] font-black tracking-tight text-white mb-1 shadow-black drop-shadow-md">
                            16,657.92
                          </p>
                          <div className="flex items-center gap-3 text-xs font-semibold">
                            <span className="text-gray-300">Total Balance</span>
                            <span className="text-green-400 flex items-center">▲ 651.4%</span>
                          </div>
                        </div>
                        {/* Mini abstract chart right inside this card */}
                        <div className="w-32 h-16 flex items-end justify-between px-2">
                           {[20,35,50,40,65,75,45,80,60].map((h, i) => (
                             <motion.div key={i} initial={{ height: 0 }} animate={{ height: h + "%" }} className="w-1.5 rounded-t-sm" style={{ backgroundColor: i % 2 === 0 ? "#4b4dff" : "#ec4899" }} />
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Gauge Card */}
               <div className="relative rounded-[30px] border border-indigo-500/20 bg-[#10142e] shadow-[0_0_30px_rgba(0,0,0,0.5)] p-6 flex items-center justify-center">
                 <div className="absolute top-4 right-4"><span className="text-gray-400 text-xs flex"><ShieldAlert className="w-3 h-3 mr-1" /> Secure</span></div>
                 <div className="flex items-center gap-4 w-full justify-center mt-2">
                    {/* Simplified Fake Canvas Gauge */}
                    <div className="relative w-[100px] h-[100px] flex items-center justify-center">
                       <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                         <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1c2140" strokeWidth="12" />
                         <circle cx="50" cy="50" r="40" fill="transparent" stroke="url(#orangeGlow)" strokeWidth="12" strokeDasharray="251.2" strokeDashoffset="113.04" strokeLinecap="round" />
                         <defs>
                           <linearGradient id="orangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f97316" />
                              <stop offset="100%" stopColor="#eab308" />
                           </linearGradient>
                         </defs>
                       </svg>
                       <div className="absolute text-xl font-black text-white">55%</div>
                    </div>
                    <div className="text-sm font-semibold">
                      <p className="text-gray-400 text-xs">Capacity</p>
                      <p className="text-white text-lg mt-1">1,962 / 4,000 LM</p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Main Area & Candlestick Chart */}
            <div className="flex-1 relative rounded-[30px] border border-indigo-500/20 bg-[#0c102a] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 overflow-hidden min-h-[300px]">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-gray-200">Market Trend</h3>
                 <div className="flex gap-2 text-xs">
                   <span className="text-gray-400 cursor-pointer">1H</span>
                   <span className="text-gray-400 cursor-pointer">1D</span>
                   <span className="bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)] text-white px-3 py-1 rounded-full cursor-pointer">1W</span>
                   <span className="text-gray-400 cursor-pointer">1M</span>
                 </div>
               </div>
               
               {/* 
                  Chart rendering 
                  Using SVG to draw the impressive glowing area chart and candlesticks perfectly.
               */}
               <div className="absolute inset-x-6 top-20 bottom-8 z-0 flex flex-col justify-between">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-full h-[1px] bg-indigo-500/10" />
                  ))}
               </div>
               
               <svg viewBox="0 0 1000 300" className="w-full h-full absolute inset-0 pt-20 pb-8 px-6" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                       <stop offset="60%" stopColor="#d946ef" stopOpacity="0.1" />
                       <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur stdDeviation="4" result="blur" />
                       <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                       </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Smooth Area Path */}
                  <path 
                    d="M0,250 Q50,230 100,240 T200,200 T300,260 T400,150 T500,220 T600,180 T700,230 T800,100 T900,170 T1000,80 L1000,300 L0,300 Z" 
                    fill="url(#chartGradient)" 
                  />
                  <path 
                    d="M0,250 Q50,230 100,240 T200,200 T300,260 T400,150 T500,220 T600,180 T700,230 T800,100 T900,170 T1000,80" 
                    fill="none" 
                    stroke="#4b4dff" 
                    strokeWidth="3" 
                    filter="url(#glow)"
                  />
                  
                  {/* Candlesticks (Fake visual mockups) */}
                  {[
                    {x:50,  open:240, close:220, high:210, low:260, up:true},
                    {x:100, open:220, close:240, high:200, low:250, up:false},
                    {x:150, open:240, close:200, high:170, low:260, up:true},
                    {x:200, open:200, close:215, high:180, low:230, up:false},
                    {x:260, open:215, close:240, high:205, low:250, up:false},
                    {x:300, open:240, close:260, high:210, low:270, up:false},
                    {x:350, open:260, close:190, high:160, low:280, up:true},
                    {x:420, open:150, close:170, high:130, low:180, up:false},
                    {x:470, open:170, close:200, high:160, low:210, up:false},
                    {x:550, open:220, close:190, high:180, low:230, up:true},
                    {x:630, open:180, close:210, high:160, low:220, up:false},
                    {x:700, open:210, close:230, high:190, low:250, up:false},
                    {x:750, open:230, close:160, high:130, low:240, up:true},
                    {x:820, open:160, close:130, high:100, low:170, up:true},
                    {x:870, open:130, close:150, high:110, low:160, up:false},
                    {x:930, open:150, close:120, high:80, low:160, up:true},
                    {x:980, open:120, close:80,  high:60, low:140, up:true},
                  ].map((c, i) => (
                    <g key={i}>
                       {/* Wick */}
                       <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={c.up ? "#10b981" : "#f43f5e"} strokeWidth="1.5" />
                       {/* Body */}
                       <rect 
                         x={c.x - 3.5} 
                         y={Math.min(c.open, c.close)} 
                         width="7" 
                         height={Math.max(c.open, c.close) - Math.min(c.open, c.close) || 2} 
                         fill={c.up ? "#10b981" : "#f43f5e"}
                         rx="1.5"
                       />
                    </g>
                  ))}
               </svg>
            </div>

            {/* Bottom Row - Volume & Donut charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[220px]">
               {/* Volume Bar Chart */}
               <div className="rounded-[30px] border border-indigo-500/20 bg-[#0d122b] shadow-[0_0_20px_rgba(0,0,0,0.4)] p-6">
                 <h3 className="font-bold text-gray-200 text-sm mb-4">Volume Overview</h3>
                 <div className="flex items-end justify-between h-[120px] pb-2 text-indigo-400">
                    {[3, 4, 2, 7, 5, 8, 3, 2, 6, 9, 7, 4, 3, 5, 4, 8, 3, 6, 9, 6].map((h, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ height: 0 }} 
                         animate={{ height: `${h * 10}%` }} 
                         className="w-2.5 rounded-t-md hover:bg-pink-400 transition-colors"
                         style={{ backgroundColor: h > 6 ? "#8b5cf6" : "#4f46e5" }}
                       />
                    ))}
                 </div>
                 <div className="border-t border-indigo-500/20 pt-2 flex justify-between text-[10px] text-gray-500">
                   <span>9:00</span>
                   <span>10:00</span>
                   <span>11:00</span>
                   <span>12:00</span>
                   <span>1:00</span>
                   <span>2:00</span>
                 </div>
               </div>

               {/* Donut Distribution Card */}
               <div className="rounded-[30px] border border-indigo-500/20 bg-[#11142e] shadow-[0_0_20px_rgba(0,0,0,0.4)] p-6 flex flex-col items-center justify-center relative">
                 <h3 className="font-bold text-gray-200 text-sm absolute top-6 left-6">Asset Allocation</h3>
                 <div className="absolute top-6 right-6 text-xl font-bold">85.00%</div>
                 <div className="relative w-[130px] h-[130px] mt-6 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#1c2140" strokeWidth="18" />
                      {/* Pink section */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#ec4899" strokeWidth="18" strokeDasharray="219.8" strokeDashoffset="50" strokeLinecap="butt" />
                      {/* Blue section */}
                      <circle cx="50" cy="50" r="35" fill="transparent" stroke="#3b82f6" strokeWidth="18" strokeDasharray="219.8" strokeDashoffset="180" strokeLinecap="butt" className="origin-center rotate-45" />
                    </svg>
                    <div className="absolute font-black text-gray-300 text-[10px]">6-5%</div>
                 </div>
               </div>
            </div>
            
          </div>

          {/* Right Sidebar Column */}
          <div className="w-full xl:w-4/12 flex flex-col gap-6">
            
            {/* Top Stat Widget 1 */}
            <div className="p-6 rounded-[30px] border border-indigo-500/20 bg-[#0c102a] flex justify-between items-center shadow-lg relative overflow-hidden">
               <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
               <div>
                  <p className="text-sm text-gray-400 mb-1">Top Gainers</p>
                  <div className="flex items-baseline gap-2">
                     <p className="text-[28px] font-black tracking-tight">57.42</p>
                     <span className="text-sm font-semibold text-gray-400">/m</span>
                  </div>
               </div>
               <div className="w-20 h-12 flex items-end justify-between">
                  {[4, 6, 8, 3, 7, 5, 9].map((h, i) => (
                    <div key={i} className="w-2 rounded-t-md opacity-90" style={{ height: `${h * 10}px`, backgroundColor: ['#ec4899','#f43f5e','#f97316','#eab308','#84cc16','#22c55e','#14b8a6'][i] }} />
                  ))}
               </div>
            </div>

            {/* Top Stat Widget 2 */}
            <div className="p-6 rounded-[30px] border border-indigo-500/20 bg-[#0c102a] flex justify-between items-center shadow-lg">
               <div>
                  <p className="text-sm text-gray-400 mb-1">Power limit</p>
                  <p className="text-[24px] font-black tracking-tight">10,325 <span className="text-gray-600 font-light mx-2">|</span> 90,018</p>
               </div>
               <div className="text-indigo-500"><Settings className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity cursor-pointer" /></div>
            </div>

            {/* Sparkline Widget */}
            <div className="flex-1 min-h-[170px] p-6 rounded-[30px] border border-indigo-500/20 bg-[#0c102a] flex flex-col justify-between shadow-lg relative overflow-hidden">
               <div className="flex justify-between w-full z-10">
                 <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Live analysis</p>
                 <ChevronDown className="w-4 h-4 text-gray-500" />
               </div>
               {/* Absolute positioned SVG graph filling the area */}
               <svg viewBox="0 0 200 100" className="absolute bottom-0 left-0 w-full h-[80%] opacity-90" preserveAspectRatio="none">
                 <path d="M0,80 Q25,60 50,70 T100,30 T150,50 T200,10" fill="none" stroke="#f43f5e" strokeWidth="2.5" filter="url(#glow2)"/>
                 <path d="M0,80 Q25,60 50,70 T100,30 T150,50 T200,10 L200,100 L0,100 Z" fill="url(#pinkGlint)" />
                 <defs>
                   <linearGradient id="pinkGlint" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                     <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                   </linearGradient>
                   <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
                       <feGaussianBlur stdDeviation="2" result="blur" />
                       <feMerge>
                          <feMergeNode in="blur" />
                          <feMergeNode in="SourceGraphic" />
                       </feMerge>
                    </filter>
                 </defs>
               </svg>
            </div>

            {/* Mini Candlestick Card */}
            <div className="flex-1 min-h-[170px] p-6 rounded-[30px] border border-indigo-500/20 bg-[#0c102a] flex flex-col justify-between shadow-lg relative overflow-hidden">
               <div className="flex justify-between w-full z-10 mb-4">
                 <div>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Financial feed</p>
                   <p className="text-lg font-black tracking-tight text-white flex items-center">
                     696.4k <span className="text-green-500 text-xs ml-2">▲ 1.35%</span>
                   </p>
                 </div>
                 <div className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-md h-fit">Daily</div>
               </div>
               {/* Mini Candlesticks */}
               <div className="flex-1 flex items-end justify-between px-2 pt-4">
                  {[
                    {h:40, up:true}, {h:50, up:false}, {h:60, up:true}, {h:30, up:false}, 
                    {h:70, up:true}, {h:85, up:true}, {h:60, up:false}, {h:90, up:true},
                    {h:70, up:false}, {h:80, up:true}, {h:50, up:false}, {h:65, up:true}
                  ].map((c, i) => (
                    <div key={i} className="flex flex-col items-center justify-end w-1.5 h-full relative">
                        <div className={`absolute w-[1px] h-[130%] top-[-15%] ${c.up ? 'bg-blue-400' : 'bg-red-400'}`} />
                        <motion.div 
                          initial={{ height: 0 }} 
                          animate={{ height: `${c.h}%` }} 
                          className={`w-full z-10 rounded-sm ${c.up ? 'bg-blue-500' : 'bg-red-500'}`} 
                        />
                    </div>
                  ))}
               </div>
            </div>

            {/* Bottom Stat Widget */}
            <div className="p-6 rounded-[30px] border border-indigo-500/20 bg-[#0c102a] flex justify-between items-center shadow-lg">
               <div>
                  <p className="text-sm text-gray-400 mb-1">Portfolio yield</p>
                  <p className="text-[26px] font-black tracking-tight">8.06 <span className="text-gray-600 font-light mx-2">|</span> 6,809</p>
               </div>
            </div>
            
          </div>
        </div>
      </main>

    </div>
  );
}
