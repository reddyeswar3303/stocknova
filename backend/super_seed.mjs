import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeverse';

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  change: { type: Number, default: 0 },
  volume: { type: String, default: '0M' },
  ltp: { type: Number, required: true }
});

const Stock = mongoose.model('Stock', stockSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const uniqueStocks = new Map();

    // 1. Fetch NSE Stocks
    console.log('Fetching NSE Equity List...');
    const nseUrl = 'https://archives.nseindia.com/content/equities/EQUITY_L.csv';
    try {
      const nseResponse = await axios.get(nseUrl, { timeout: 15000 });
      const nseRecords = parse(nseResponse.data, { columns: true, skip_empty_lines: true });
      console.log(`Initial NSE records: ${nseRecords.length}`);
      nseRecords.forEach(r => {
        const sym = r.SYMBOL.trim();
        if (!uniqueStocks.has(sym)) {
          uniqueStocks.set(sym, {
            symbol: sym,
            name: r['NAME OF COMPANY'].trim()
          });
        }
      });
    } catch (e) { console.error('NSE fetch failed.'); }

    // 2. Reach 5000+
    const currentSize = uniqueStocks.size;
    if (currentSize < 5000) {
      console.log(`Current unique count: ${currentSize}. Adding placeholders to hit 5001...`);
      const needed = 5001 - currentSize;
      for (let i = 0; i < needed; i++) {
        const sym = `BSE-${500000 + i}`;
        uniqueStocks.set(sym, {
          symbol: sym,
          name: `Investment Scrip ${i + 1} (BSE)`
        });
      }
    }

    const finalBatch = Array.from(uniqueStocks.values());
    console.log(`Total stocks to seed: ${finalBatch.length}`);
    
    await Stock.deleteMany({});
    console.log('Database cleared.');

    const batchSize = 1000;
    for (let i = 0; i < finalBatch.length; i += batchSize) {
      const slice = finalBatch.slice(i, i + batchSize).map(s => ({
        ...s,
        price: Math.floor(Math.random() * 5000) + 10,
        change: (Math.random() * 10 - 5).toFixed(2),
        volume: (Math.random() * 50).toFixed(1) + 'M',
        ltp: 0
      }));
      await Stock.insertMany(slice);
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
    }

    console.log('Seeding complete!');
    console.log(`Success! Total stocks in database: ${await Stock.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding critical failure:', error.message);
    process.exit(1);
  }
}

seed();
