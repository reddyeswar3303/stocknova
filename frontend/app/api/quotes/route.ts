import { NextResponse } from "next/server";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

const SYMBOLS = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS",
  "SBIN.NS", "WIPRO.NS", "ICICIBANK.NS", "BAJFINANCE.NS",
  "AXISBANK.NS", "KOTAKBANK.NS", "ITC.NS", "LT.NS",
  "MARUTI.NS", "TATAMOTORS.NS", "M&M.NS", "BAJAJ-AUTO.NS",
  "EICHERMOT.NS", "HEROMOTOCO.NS", "TVSMOTOR.NS",
  "TATASTEEL.NS", "ADANIPORTS.NS", "ASIANPAINT.NS"
];

function fmtVol(v: number): string {
  if (v >= 10_000_000) return `${(v / 10_000_000).toFixed(1)}Cr`;
  if (v >= 100_000)    return `${(v / 100_000).toFixed(1)}L`;
  if (v >= 1_000)      return `${(v / 1_000).toFixed(1)}K`;
  return String(v);
}

export async function GET() {
  try {
    // Fetch quotes individually to prevent a single bad ticker from breaking everything
    const promises = SYMBOLS.map(sym => (yahooFinance.quote(sym) as Promise<any>).catch(() => null));
    const resultsRaw = await Promise.all(promises);
    
    // Filter out nulls (failed tickers)
    const results = resultsRaw.filter((q: any) => q !== null && q !== undefined);

    if (!results.length) {
      throw new Error("All tickers failed to fetch");
    }

    const stocks = results.map((q: any) => ({
      symbol:    (q.symbol as string).replace(".NS", "").replace(".BO", "").replace("^BSESN", "SENSEX").replace("^NSEI", "NIFTY_50").replace("^CNXAUTO", "NIFTY_AUTO"),
      name:      (q.symbol === "^CNXAUTO" ? "Nifty Auto" : q.symbol === "^BSESN" ? "BSE SENSEX" : q.symbol === "^NSEI" ? "NIFTY 50" : (q.shortName ?? q.longName ?? q.symbol)),
      price:     parseFloat((q.regularMarketPrice ?? 0).toFixed(2)),
      change:    parseFloat((q.regularMarketChangePercent ?? 0).toFixed(2)),
      changeAbs: parseFloat((q.regularMarketChange ?? 0).toFixed(2)),
      volume:    fmtVol(q.regularMarketVolume ?? 0),
      high:      parseFloat((q.regularMarketDayHigh ?? 0).toFixed(2)),
      low:       parseFloat((q.regularMarketDayLow ?? 0).toFixed(2)),
      ltp:       parseFloat((q.regularMarketPrice ?? 0).toFixed(2)),
    }));

    return NextResponse.json({ success: true, data: stocks });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
