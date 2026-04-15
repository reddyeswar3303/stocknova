const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();

const SYMBOLS = [
  "^BSESN", "^NSEI", "^CNXAUTO",
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "INFY.NS",
  "SBIN.NS", "WIPRO.NS", "ICICIBANK.NS", "BAJFINANCE.NS",
  "AXISBANK.NS", "KOTAKBANK.NS", "ITC.NS", "LT.NS",
  "MARUTI.NS", "TATAMOTORS.NS", "M&M.NS", "BAJAJ-AUTO.NS",
  "EICHERMOT.NS", "HEROMOTOCO.NS", "TVSMOTOR.NS"
];

yahooFinance.quote(SYMBOLS).then(res => {
  console.log('Success:', res.length);
}).catch(err => {
  console.error("FAILED::", err.message);
});
