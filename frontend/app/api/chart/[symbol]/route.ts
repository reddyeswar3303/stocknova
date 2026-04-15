import { NextResponse } from "next/server";
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol } = await params;
    const sym = symbol.toUpperCase();
    let yahooSym = "";
    
    if (sym === "SENSEX") yahooSym = "^BSESN";
    else if (sym === "NIFTY_50" || sym === "NIFTY 50") yahooSym = "^NSEI";
    else if (sym === "NIFTY_AUTO" || sym === "NIFTY AUTO") yahooSym = "^CNXAUTO";
    else if (sym.startsWith("BSE-") || /^\d{6}$/.test(sym)) yahooSym = `${sym.replace("BSE-", "")}.BO`;
    else yahooSym = sym.includes('.') ? sym : `${sym}.NS`;

    const period1 = Math.floor(Date.now() / 1000) - (24 * 60 * 60); // 24h ago
    const result: any = await yahooFinance.chart(yahooSym, { interval: '5m', period1 });

    if (!result || !result.quotes || result.quotes.length === 0) {
      console.warn(`No chart data found for ${yahooSym}`);
      return NextResponse.json({ success: false, error: "No historical data available for this symbol on Yahoo Finance." }, { status: 404 });
    }

    const closes = result.quotes.map((q: any) => q.close);
    const prices = closes
      .filter((c: any): c is number => c !== null && c > 0)
      .map((c: any) => parseFloat(c.toFixed(2)));

    if (prices.length === 0) {
      return NextResponse.json({ success: false, error: "Market is currently closed or no price points available for the last 24h." }, { status: 404 });
    }

    const meta: any = result.meta ?? {};

    return NextResponse.json({
      success: true,
      data: {
        prices,
        currentPrice:  parseFloat((meta.regularMarketPrice ?? 0).toFixed(2)),
        previousClose: parseFloat((meta.previousClose ?? 0).toFixed(2)),
        currency:      meta.currency ?? "INR",
      },
    });
  } catch (err: any) {
    console.error("Chart API Error:", err.message);
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch market data. " + (err.message.includes('rate limit') ? "Rate limit exceeded." : "Please try again later.")
    }, { status: 500 });
  }
}
