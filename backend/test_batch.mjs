import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

const SYMBOLS = [
  "^BSESN", "^NSEI", "^CNXAUTO",
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS",
  "SBIN.NS", "WIPRO.NS", "ICICIBANK.NS", "BAJFINANCE.NS",
  "AXISBANK.NS", "KOTAKBANK.NS", "ITC.NS", "LT.NS",
  "MARUTI.NS", "TATAMOTORS.NS", "M&M.NS", "BAJAJ-AUTO.NS",
  "EICHERMOT.NS", "HEROMOTOCO.NS", "TVSMOTOR.NS"
];

yahooFinance.quote(SYMBOLS).then(quotes => {
  const results = Array.isArray(quotes) ? quotes : [quotes];
  const stocks = results.map((q) => ({
      symbol: (q.symbol).replace(".NS", ""),
      price: q.regularMarketPrice
  }));
  console.log('Success! Count:', stocks.length);
  console.log(stocks.slice(0,3));
}).catch(err => {
  console.error("Error occurred:");
  console.error(err);
});
