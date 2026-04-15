require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const { User, Stock, Trade, Transaction, Holding } = require('./models');
const http = require('http');
const { Server } = require('socket.io');
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance();
const { fetchLivePrices } = require('./services/alphaVantage');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Live Stock Update Logic - Using Set for O(1) ops and uniqueness
let SYMBOLS = new Set([
  'ABB.NS', 'ACC.NS', 'ADANIENT.NS', 'ADANIPORTS.NS', 'ADANIPOWER.NS', 'AMBUJACEM.NS', 'APOLLOHOSP.NS', 'APOLLOTYRE.NS', 'ASHOKLEY.NS', 'ASIANPAINT.NS', 'ASTRAL.NS', 'ATGL.NS', 'AUBANK.NS', 'AUROPHARMA.NS', 'AXISBANK.NS', 'BAJAJ-AUTO.NS', 'BAJAJFINSV.NS', 'BAJFINANCE.NS', 'BALKRISIND.NS', 'BANDHANBNK.NS', 'BANKBARODA.NS', 'BEL.NS', 'BHEL.NS', 'BIOCON.NS', 'BPCL.NS', 'BRITANNIA.NS', 'BSOFT.NS', 'CANBK.NS', 'CDSL.NS', 'CHOLAFIN.NS', 'CIPLA.NS', 'COALINDIA.NS', 'COFORGE.NS', 'COLPAL.NS', 'CONCOR.NS', 'COROMANDEL.NS', 'CROMPTON.NS', 'CUMMINSIND.NS', 'DABUR.NS', 'DALBHARAT.NS', 'DEEPAKNTR.NS', 'DELHIVERY.NS', 'DIVISLAB.NS', 'DIXON.NS', 'DLF.NS', 'DRREDDY.NS', 'EICHERMOT.NS', 'ESCORTS.NS', 'EXIDEIND.NS', 'FEDERALBNK.NS', 'FORTIS.NS', 'GAIL.NS', 'GLENMARK.NS', 'GMRINFRA.NS', 'GODREJCP.NS', 'GODREJPROP.NS', 'GRANULES.NS', 'GRASIM.NS', 'GUJGASLTD.NS', 'HAL.NS', 'HAVELLS.NS', 'HCLTECH.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS', 'HEROMOTOCO.NS', 'HINDALCO.NS', 'HINDCOPPER.NS', 'HINDPETRO.NS', 'HINDUNILVR.NS', 'ICICIBANK.NS', 'ICICIGI.NS', 'ICICIPRULI.NS', 'IDFC.NS', 'IDFCFIRSTB.NS', 'IEX.NS', 'IGL.NS', 'INDHOTEL.NS', 'INDIANB.NS', 'INDIGO.NS', 'INDUSINDBK.NS', 'INDUSTOWER.NS', 'INFY.NS', 'IOC.NS', 'IRCTC.NS', 'IRFC.NS', 'ITC.NS', 'JINDALSTEL.NS', 'JSL.NS', 'JSWENERGY.NS', 'JSWSTEEL.NS', 'JUBLFOOD.NS', 'KALYANKJIL.NS', 'KEC.NS', 'KEI.NS', 'KOTAKBANK.NS', 'KPITTECH.NS', 'L&TFH.NS', 'LICHSGFIN.NS', 'LICI.NS', 'LTIM.NS', 'LTTS.NS', 'LUPIN.NS', 'M&M.NS', 'M&MFIN.NS', 'MANAPPURAM.NS', 'MARICO.NS', 'MARUTI.NS', 'MAZDOCK.NS', 'MCDOWELL-N.NS', 'MCX.NS', 'METROPOLIS.NS', 'MGL.NS', 'MPHASIS.NS', 'MRF.NS', 'MUTHOOTFIN.NS', 'NATIONALUM.NS', 'NAUKRI.NS', 'NAVINFLUOR.NS', 'NESTLEIND.NS', 'NMDC.NS', 'NTPC.NS', 'NYKAA.NS', 'OBEROIRLTY.NS', 'ONGC.NS', 'PAGEIND.NS', 'PAYTM.NS', 'PEL.NS', 'PERSISTENT.NS', 'PETRONET.NS', 'PFC.NS', 'PHOENIXLTD.NS', 'PIDILITIND.NS', 'PIIND.NS', 'PNB.NS', 'POLYCAB.NS', 'POONAWALLA.NS', 'POWERGRID.NS', 'PRESTIGE.NS', 'RAINBOW.NS', 'RAMCOCEM.NS', 'RATNAMANI.NS', 'RAYMOND.NS', 'RECLTD.NS', 'RELIANCE.NS', 'RVNL.NS', 'SAIL.NS', 'SBICARD.NS', 'SBILIFE.NS', 'SBIN.NS', 'SCHAEFFLER.NS', 'SHREECEM.NS', 'SHRIRAMFIN.NS', 'SIEMENS.NS', 'SKFINDIA.NS', 'SONACOMS.NS', 'SRF.NS', 'STARHEALTH.NS', 'SUNPHARMA.NS', 'SUNTV.NS', 'SUPREMEIND.NS', 'SYNGENE.NS', 'TATACHEM.NS', 'TATACOMM.NS', 'TATACONSUM.NS', 'TATAELXSI.NS', 'TATAMOTORS.NS', 'TATAPOWER.NS', 'TATASTEEL.NS', 'TCS.NS', 'TECHM.NS', 'THERMAX.NS', 'TITAN.NS', 'TORNTPHARM.NS', 'TRENT.NS', 'TRIDENT.NS', 'TRITURBINE.NS', 'TIINDIA.NS', 'UBL.NS', 'ULTRACEMCO.NS', 'UNIONBANK.NS', 'UNOMINDA.NS', 'UPL.NS', 'VBL.NS', 'VEDL.NS', 'VOLTAS.NS', 'WHIRLPOOL.NS', 'WIPRO.NS', 'YESBANK.NS', 'ZEEL.NS', 'ZOMATO.NS'
]);

let latestPrices = {};

io.on('connection', (socket) => {
  console.log('Client connected to live stock feed');
  if (Object.keys(latestPrices).length > 0) {
    socket.emit('stockUpdates', Object.values(latestPrices));
  }
  socket.on('disconnect', () => {
    console.log('Client disconnected from live feed');
  });
});

// Update logic with batching to handle 500+ symbols without timeout
async function updateMarketPrices() {
  try {
    const symbolArray = Array.from(SYMBOLS);
    const batchSize = 50;
    for (let i = 0; i < symbolArray.length; i += batchSize) {
      const batch = symbolArray.slice(i, i + batchSize);
      const quotes = await yahooFinance.quote(batch);
      
      const updates = [];
      for (const q of quotes) {
        if (!q.symbol || !q.regularMarketPrice) continue;
        const cleanSymbol = q.symbol.split('.')[0];
        const stockData = {
          symbol: cleanSymbol,
          name: q.shortName || cleanSymbol,
          price: parseFloat(q.regularMarketPrice.toFixed(2)),
          change: parseFloat((q.regularMarketChangePercent || 0).toFixed(2)),
          volume: q.regularMarketVolume ? (q.regularMarketVolume / 1000000).toFixed(1) + 'M' : '0M',
          ltp: parseFloat(q.regularMarketPrice.toFixed(2))
        };
        updates.push(stockData);
        latestPrices[cleanSymbol] = stockData;
      }
      
      if (updates.length > 0) {
        io.emit('stockUpdates', updates);
        // Sync with DB
        for (const upd of updates) {
          Stock.updateOne({ symbol: upd.symbol }, { $set: upd }, { upsert: true }).catch(() => {});
        }
      }
      
      // Small delay between batches to avoid rate limits
      if (symbolArray.length > batchSize) await new Promise(r => setTimeout(r, 500));
    }
  } catch (error) {
    console.error('Market update cycle failed:', error.message);
  }
}

setInterval(updateMarketPrices, 15000);

// ========== RESET API ==========
app.post('/api/user/reset', async (req, res) => {
  try {
    await Promise.all([
      Transaction.deleteMany(),
      Trade.deleteMany(),
      Holding.deleteMany()
    ]);
    res.json({ success: true, message: 'All trading data cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== STOCKS API ==========
app.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json({ success: true, data: stocks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


app.get('/api/stocks/news/:symbol', async (req, res) => {
  try {
    const result = await yahooFinance.search(req.params.symbol);
    res.json({ success: true, data: result.news || [] });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol });
    if (!stock) return res.status(404).json({ success: false, error: 'Stock not found' });
    res.json({ success: true, data: stock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stocks/details/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.includes('.') ? req.params.symbol : `${req.params.symbol}.NS`;
    const quote = await yahooFinance.quote(symbol);
    
    // Supplement with database info if available
    const dbStock = await Stock.findOne({ symbol: req.params.symbol.split('.')[0] });

    const details = {
      symbol: quote.symbol.replace('.NS', '').replace('.BO', ''),
      name: quote.shortName || quote.longName || dbStock?.name || quote.symbol,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChangePercent,
      changeAbs: quote.regularMarketChange,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      peRatio: quote.trailingPE,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      avgVolume: quote.averageDailyVolume3Month,
      exchange: quote.fullExchangeName,
      currency: quote.currency
    };

    res.json({ success: true, data: details });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// Updated to use Yahoo Finance for better reliability without API keys
app.get('/api/stocks/live', async (req, res) => {
  try {
    const symbols = req.query.symbols ? req.query.symbols.split(',') : ['AAPL', 'MSFT', 'GOOGL', 'AMZN'];
    const results = await yahooFinance.quote(symbols);
    
    const data = results.map(q => ({
      symbol: q.symbol,
      price: q.regularMarketPrice,
      change: q.regularMarketChange || 0,
      changePercent: q.regularMarketChangePercent ? `${q.regularMarketChangePercent.toFixed(2)}%` : "0.00%",
      volume: q.regularMarketVolume ? (q.regularMarketVolume / 1000000).toFixed(1) + 'M' : '0M',
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Market data service unavailable' });
  }
});

app.get('/api/stocks/search/:query', async (req, res) => {
  try {
    let queryValue = req.params.query;
    queryValue = queryValue.replace(/\s+(stocks|stock|share|shares|price|quoted|today)$/i, "").trim();
    
    // Search both Yahoo and local Database
    const [yahooResults, dbResults] = await Promise.all([
      yahooFinance.search(queryValue),
      Stock.find({
        $or: [
          { symbol: { $regex: queryValue, $options: 'i' } },
          { name: { $regex: queryValue, $options: 'i' } }
        ]
      }).limit(10)
    ]);

    const quotes = yahooResults.quotes ? yahooResults.quotes.filter(q => 
      q.quoteType === 'EQUITY' || q.quoteType === 'ETF' || q.quoteType === 'INDEX'
    ) : [];

    // Transform DB results to match quote format
    const dbQuotes = dbResults.map(s => ({
      symbol: s.symbol,
      shortname: s.name,
      longname: s.name,
      quoteType: 'EQUITY',
      fromDb: true
    }));

    // Merge and remove duplicates by symbol
    const merged = [...dbQuotes, ...quotes];
    const seen = new Set();
    const unique = merged.filter(q => {
      const s = q.symbol.toUpperCase();
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    });

    res.json({ success: true, data: unique.slice(0, 20) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/stocks/track', async (req, res) => {
  try {
    const { symbol } = req.body;
    if (!symbol) return res.status(400).json({ success: false, error: 'Symbol is required' });
    
    SYMBOLS.add(symbol);
    const q = await yahooFinance.quote(symbol);
    if (!q || !q.regularMarketPrice) return res.status(404).json({ success: false, error: 'Could not fetch quote' });
    
    const cleanSymbol = q.symbol.split('.')[0] || q.symbol;
    const newStock = {
      symbol: cleanSymbol,
      name: q.shortName || cleanSymbol,
      price: parseFloat(q.regularMarketPrice.toFixed(2)),
      change: parseFloat((q.regularMarketChangePercent !== undefined ? q.regularMarketChangePercent : 0).toFixed(2)),
      volume: q.regularMarketVolume ? (q.regularMarketVolume / 1000000).toFixed(1) + 'M' : '0M',
      ltp: parseFloat(q.regularMarketPrice.toFixed(2))
    };
    
    await Stock.updateOne({ symbol: cleanSymbol }, { $set: newStock }, { upsert: true });
    
    // Immediate broadcast
    latestPrices[cleanSymbol] = newStock;
    io.emit('stockUpdates', [newStock]);
    
    res.json({ success: true, data: newStock });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/stocks/movers', async (req, res) => {
  try {
    const results = await yahooFinance.dailyGainers({ count: 15, region: 'IN' });
    const losers = await yahooFinance.dailyLosers({ count: 15, region: 'IN' });
    
    const mapQuotes = (quotes) => quotes.map(q => ({
      symbol: q.symbol.split('.')[0] || q.symbol,
      name: q.shortName || q.symbol.split('.')[0],
      price: q.regularMarketPrice,
      change: q.regularMarketChangePercent,
      fullSymbol: q.symbol
    }));

    res.json({ 
      success: true, 
      data: { 
        gainers: mapQuotes(results.quotes), 
        losers: mapQuotes(losers.quotes) 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== USER API ==========
app.get('/api/user/portfolio', async (req, res) => {
  try {
    const { userId } = req.query;
    
    let balance = 0;
    let traderLevel = 'Beginner';
    
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        balance = user.balance || 0;
        traderLevel = user.traderLevel || 'Beginner';
      }
    } else {
      // Fallback: Calculate from all fund transactions if no userId (legacy support)
      const transactions = await Transaction.find();
      transactions.forEach(tx => {
        if (tx.status === 'completed') {
          if (tx.type === 'deposit') {
            balance += tx.amount;
          } else if (tx.type === 'withdrawal') {
            balance -= tx.amount;
          }
        }
      });
    }
    
    const portfolio = {
      totalValue: 0,
      dayGain: 0,
      dayGainPercent: 0,
      gainPercent: 0,
      availableFunds: Math.max(0, balance),
      totalLimit: 500000,
      traderLevel: traderLevel,
      expPoints: 0,
      nextLevelExp: 5000,
    };
    res.json({ success: true, data: portfolio });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/holdings', async (req, res) => {
  try {
    const holdings = await Holding.find();
    res.json({ success: true, data: holdings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/orders', async (req, res) => {
  try {
    const orders = await Trade.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/trades', async (req, res) => {
  try {
    const trades = await Trade.find().sort({ createdAt: -1 });
    res.json({ success: true, data: trades });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/user/funds/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json({ success: true, data: transactions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== TRADING API ==========
app.post('/api/trades', async (req, res) => {
  try {
    const { type, stock, quantity, price, userId } = req.body;
    
    const total = parseInt(quantity) * parseFloat(price);
    
    const newTrade = new Trade({
      type,
      stock,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      total,
      time: new Date().toLocaleString('en-IN'),
      status: 'completed',
      userId: userId || null
    });
    
    await newTrade.save();

    let updatedBalance = 0;
    // Update user balance and trade count
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (type === 'buy') {
          user.balance -= total;
        } else if (type === 'sell') {
          user.balance += total;
        }
        user.trades += 1;
        await user.save();
        updatedBalance = user.balance;
      }
    }
    
    res.status(201).json({ success: true, message: 'Trade executed successfully', data: newTrade, updatedBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== FUNDS API ==========
app.post('/api/funds/add', async (req, res) => {
  try {
    const { amount, userId } = req.body;
    
    let userName = 'Current User';
    if (userId) {
      const user = await User.findById(userId);
      if (user) userName = user.name;
    }

    const transaction = new Transaction({
      user: userName,
      userId: userId || null,
      type: 'deposit',
      amount: parseFloat(amount),
      status: 'completed',
      time: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    });
    
    await transaction.save();

    let updatedBalance = 0;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.balance += parseFloat(amount);
        if (req.body.traderLevel) {
          user.traderLevel = req.body.traderLevel;
        }
        await user.save();
        updatedBalance = user.balance;
      }
    }
    
    res.json({ success: true, message: 'Funds added successfully', data: transaction, updatedBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/funds/withdraw', async (req, res) => {
  try {
    const { amount, userId, upiId } = req.body;
    
    let userName = 'Current User';
    if (userId) {
      const user = await User.findById(userId);
      if (user) userName = user.name;
    }

    const transaction = new Transaction({
      user: userName,
      userId: userId || null,
      type: 'withdrawal',
      amount: parseFloat(amount),
      upiId: upiId || null,
      status: 'completed',
      time: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    });
    
    await transaction.save();

    let updatedBalance = 0;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.balance -= parseFloat(amount);
        await user.save();
        updatedBalance = user.balance;
      }
    }
    
    res.json({ success: true, message: 'Withdrawal successful', data: transaction, updatedBalance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== PAYMENT VERIFICATION API ==========
app.post('/api/payment/verify', async (req, res) => {
  try {
    const { paymentId, amount, userId, tierName } = req.body;
    
    // In a real app, you would verify this with Razorpay/Stripe API using paymentId
    if (amount > 0 && !paymentId) {
      return res.status(400).json({ success: false, error: 'Payment verification failed: No payment identifier provided.' });
    }

    // Verify amount is reasonable for the tier (Mock validation)
    const tierPrices = { Beginner: 199, Intermediate: 499, Pro: 999 };
    const basePrice = tierPrices[tierName] || 199;
    
    // Allow for any amount (could be discounted) as long as it's not negative
    if (amount < 0) {
      return res.status(400).json({ success: false, error: 'Invalid payment amount.' });
    }

    // Simulate thorough verification delay
    await new Promise(r => setTimeout(r, 1500));

    // Logic to add funds/activate tier
    const starterFunds = { Beginner: 10000, Intermediate: 25000, Pro: 50000 };
    const funds = starterFunds[tierName] || 10000;
    
    let updatedBalance = 0;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.balance += funds;
        user.traderLevel = tierName;
        await user.save();
        updatedBalance = user.balance;

        // Create transaction record
        const transaction = new Transaction({
          user: user.name,
          userId: user._id,
          type: 'deposit',
          amount: funds,
          status: 'completed',
          time: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          description: `Subscription activation: ${tierName} Plan`
        });
        await transaction.save();
      } else {
         return res.status(404).json({ success: false, error: 'User not found in system.' });
      }
    } else {
       return res.status(401).json({ success: false, error: 'Authentication required for activation.' });
    }

    res.json({ 
      success: true, 
      message: 'Payment verified and account activated',
      data: { funds, tierName, updatedBalance }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error during verification: ' + error.message });
  }
});

// ========== AUTH API ==========
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'Account not found with this email' });
    }
    user.password = password;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN STATS API ==========
app.get('/api/admin/stats', async (req, res) => {
  try {
    const [totalUsers, activeTradersCount, trades] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', trades: { $gt: 0 } }),
      Trade.find()
    ]);

    const totalVolume = trades.reduce((sum, t) => sum + (t.total || 0), 0);
    const revenue = totalVolume * 0.005; // 0.5% platform fee/revenue model

    res.json({
      success: true,
      data: {
        totalUsers: totalUsers.toLocaleString(),
        activeTraders: activeTradersCount.toLocaleString(),
        totalVolume: totalVolume > 10000000 ? `₹${(totalVolume/10000000).toFixed(2)}Cr` : `₹${(totalVolume/100000).toFixed(2)}L`,
        revenue: `₹${(revenue/100000).toFixed(2)}L`,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN API ==========
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'name').sort({ createdAt: -1 });
    // Map transactions to use the populated name if available
    const mappedData = transactions.map(tx => {
      const txObj = tx.toObject();
      if (txObj.userId && typeof txObj.userId === 'object' && txObj.userId.name) {
        txObj.user = txObj.userId.name;
      }
      // Fallback for old 'Current User' records
      if (!txObj.user || txObj.user === 'Current User') {
        txObj.user = 'Reddy';
      }
      return txObj;
    });
    res.json({ success: true, data: mappedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/trades', async (req, res) => {
  try {
    const trades = await Trade.find().populate('userId', 'name').sort({ createdAt: -1 });
    const mappedData = trades.map(t => {
      const tObj = t.toObject();
      if (!tObj.userId || tObj.userId === 'Current User' || (typeof tObj.userId === 'object' && !tObj.userId.name)) {
        tObj.user = 'Reddy'; 
      } else {
        tObj.user = typeof tObj.userId === 'object' ? tObj.userId.name : 'Reddy';
      }
      return tObj;
    });
    res.json({ success: true, data: mappedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    res.json({ success: true, message: `User ${status} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/users/:id/kyc', async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { kyc: status },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    
    res.json({ success: true, message: `KYC ${status} successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== AUTH API ==========
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Admin login check
    if (email.toLowerCase() === 'admin@stocknova.com' && password === 'Admin@StockNova2024') {
      return res.json({ success: true, role: 'admin', token: 'admin-token-123' });
    }
    
    // Regular user login - ONLY accept registered users
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      return res.json({ 
        success: true, 
        role: user.role, 
        token: `user-token-${user._id}`,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    }
    
    // If user not found or password doesn't match
    res.status(401).json({ success: false, error: 'Invalid email or password. Please register first.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== REGISTER API ==========
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'User already exists. Please login.' });
    }
    
    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role: 'user',
      status: 'active',
      kyc: 'pending',
      balance: 0,
      trades: 0,
      joined: 'Just now',
    });
    
    await newUser.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful. Please login.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== SEED DATA ENDPOINT ==========
app.post('/api/seed', async (req, res) => {
  try {
    // Clear existing data
    await Stock.deleteMany();
    await Holding.deleteMany();
    await Trade.deleteMany();
    await Transaction.deleteMany();
    await User.deleteMany();
    
    // Seed stocks
    const stocks = [
      { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2984.60, change: -0.45, volume: '12.5M', ltp: 2984.60 },
      { symbol: 'TCS', name: 'Tata Consultancy', price: 4012.30, change: 1.15, volume: '5.2M', ltp: 4012.30 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1532.70, change: -0.65, volume: '15.1M', ltp: 1532.70 },
      { symbol: 'INFY', name: 'Infosys Ltd', price: 1478.40, change: 0.85, volume: '9.3M', ltp: 1478.40 },
      { symbol: 'SBIN', name: 'State Bank of India', price: 768.15, change: -0.15, volume: '22.4M', ltp: 768.15 },
      { symbol: 'TATASTEEL', name: 'Tata Steel', price: 165.40, change: 1.25, volume: '25.1M', ltp: 165.40 },
      { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1342.10, change: 2.10, volume: '4.5M', ltp: 1342.10 },
      { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2854.20, change: -0.50, volume: '2.1M', ltp: 2854.20 },
      { symbol: 'WIPRO', name: 'Wipro', price: 482.40, change: -0.55, volume: '7.3M', ltp: 482.40 },
      { symbol: 'ITC', name: 'ITC Ltd', price: 432.50, change: 0.45, volume: '18.2M', ltp: 432.50 },
      { symbol: 'LT', name: 'Larsen & Toubro', price: 3672.10, change: 2.10, volume: '4.5M', ltp: 3672.10 },
      { symbol: 'TITAN', name: 'Titan Company', price: 3754.20, change: -0.50, volume: '2.1M', ltp: 3754.20 }
    ];
    await Stock.insertMany(stocks);
    
    // Seed holdings
    const holdings = [
      { symbol: 'RELIANCE', name: 'Reliance Industries', quantity: 50, avgPrice: 2350.00, currentPrice: 2456.75, invested: 117500, currentValue: 122837.50, pnl: 5337.50, pnlPercent: 4.54 },
      { symbol: 'TCS', name: 'Tata Consultancy', quantity: 25, avgPrice: 3750.00, currentPrice: 3890.50, invested: 93750, currentValue: 97262.50, pnl: 3512.50, pnlPercent: 3.75 },
      { symbol: 'HDFCBANK', name: 'HDFC Bank', quantity: 100, avgPrice: 1580.00, currentPrice: 1654.30, invested: 158000, currentValue: 165430, pnl: 7430, pnlPercent: 4.70 },
      { symbol: 'INFY', name: 'Infosys Ltd', quantity: 75, avgPrice: 1720.00, currentPrice: 1780.60, invested: 129000, currentValue: 133545, pnl: 4545, pnlPercent: 3.52 },
      { symbol: 'SBIN', name: 'State Bank of India', quantity: 200, avgPrice: 780.00, currentPrice: 742.15, invested: 156000, currentValue: 148430, pnl: -7570, pnlPercent: -4.85 },
    ];
    await Holding.insertMany(holdings);
    
    // Seed users first to get IDs
    const usersData = [
      { name: 'Reddy', email: 'reddy@example.com', password: 'password123', balance: 500000, trades: 12, status: 'active', kyc: 'verified', joined: '1 day ago' },
      { name: 'Rahul Sharma', email: 'rahul@example.com', password: 'password123', balance: 245000, trades: 156, status: 'active', kyc: 'verified', joined: '2 days ago' },
      { name: 'Priya Patel', email: 'priya@example.com', password: 'password123', balance: 189000, trades: 89, status: 'active', kyc: 'pending', joined: '5 days ago' },
    ];
    const createdUsers = await User.insertMany(usersData);
    const reddyId = createdUsers[0]._id;

    // Seed transactions with user IDs
    const transactions = [
      { user: 'Reddy', userId: reddyId, type: 'deposit', amount: 50000, status: 'completed', time: '5 mins ago' },
      { user: 'Reddy', userId: reddyId, type: 'withdrawal', amount: 25000, status: 'completed', time: '15 mins ago' },
      { user: 'Rahul Sharma', userId: createdUsers[1]._id, type: 'deposit', amount: 75000, status: 'completed', time: '1 hour ago' },
    ];
    await Transaction.insertMany(transactions);

    // Seed trades with user IDs
    const trades = [
      { userId: reddyId, type: 'buy', stock: 'RELIANCE', quantity: 50, price: 2450.00, total: 122500, time: '2 mins ago', status: 'completed' },
      { userId: createdUsers[1]._id, type: 'sell', stock: 'TCS', quantity: 25, price: 3895.00, total: 97375, time: '15 mins ago', status: 'completed' },
    ];
    await Trade.insertMany(trades);

    // CLEANUP: Update any remaining 'Current User' records to 'Reddy'
    await Transaction.updateMany({ user: 'Current User' }, { user: 'Reddy', userId: reddyId });
    await Trade.updateMany({ userId: null }, { userId: reddyId });
    
    res.json({ success: true, message: 'Database seeded successfully with linked user data' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
  console.log(`MongoDB connected - Database: tradeverse`);
});
