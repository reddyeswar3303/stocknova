"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCcw, AlertTriangle } from 'lucide-react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: string;
  error?: string;
}

const symbols = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'INFY.NS', 'SBIN.NS', 'TATAMOTORS.NS', 'ICICIBANK.NS', 'BHARTIARTL.NS', 'ZOMATO.NS', 'PAYTM.NS'];

export default function LiveStockTable() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/stocks/live?symbols=${symbols.join(',')}`);
      const json = await response.json();
      
      if (json.success) {
        setStocks(json.data);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(json.error || 'Failed to fetch stock data');
      }
    } catch (err) {
      setError('Connection to backend failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <RefreshCcw className="w-8 h-8 text-[#00D09C] animate-spin" />
        <p className="text-gray-500 font-medium">Initializing live feed...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl shadow-emerald-100/50 border border-emerald-50 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-white to-emerald-50/30">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Market</h2>
            <p className="text-sm text-gray-500">Real-time quotes via Yahoo Finance</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end text-xs font-semibold text-emerald-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Last seen: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </div>

        {error && (
          <div className="m-4 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-700 text-sm">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Symbol</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-right">Change</th>
                <th className="px-6 py-4 text-right">% Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {stocks.map((stock) => (
                  <motion.tr 
                    key={stock.symbol}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-emerald-50/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-[#00D09C]/10 group-hover:text-[#00D09C] transition-colors">
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <span className="font-bold text-gray-900">{stock.symbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">
                      ₹{stock.price.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 text-right font-semibold ${stock.change >= 0 ? 'text-[#00D09C]' : 'text-[#EB5B3C]'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${stock.change >= 0 ? 'bg-emerald-50 text-[#00D09C]' : 'bg-orange-50 text-[#EB5B3C]'}`}>
                        {stock.changePercent}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
