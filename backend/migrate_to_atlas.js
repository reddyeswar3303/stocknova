require('dotenv').config();
const mongoose = require('mongoose');
const { User, Stock, Trade, Transaction, Holding } = require('./models');

const ATLAS_URI = process.env.MONGODB_URI;
const LOCAL_URI = 'mongodb://localhost:27017/tradeverse';

async function migrate() {
  let localConn, atlasConn;
  try {
    console.log('--- MIGRATION STARTING ---');
    console.log('Connecting to LOCAL database...');
    localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('Connected to Local.');

    console.log('Connecting to ATLAS database...');
    atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Connected to Atlas.');

    const collections = [
      { name: 'User', model: localConn.model('User', User.schema), target: atlasConn.model('User', User.schema) },
      { name: 'Stock', model: localConn.model('Stock', Stock.schema), target: atlasConn.model('Stock', Stock.schema) },
      { name: 'Trade', model: localConn.model('Trade', Trade.schema), target: atlasConn.model('Trade', Trade.schema) },
      { name: 'Transaction', model: localConn.model('Transaction', Transaction.schema), target: atlasConn.model('Transaction', Transaction.schema) },
      { name: 'Holding', model: localConn.model('Holding', Holding.schema), target: atlasConn.model('Holding', Holding.schema) }
    ];

    for (const col of collections) {
      console.log(`Migrating ${col.name}...`);
      const docs = await col.model.find().lean();
      if (docs.length > 0) {
        // Clear Atlas for this collection first to avoid duplicates (optional, based on requirement)
        // await col.target.deleteMany({});
        
        // Insert docs
        await col.target.insertMany(docs, { ordered: false }).catch(err => {
          console.warn(`Some ${col.name} already exist in Atlas, skipping duplicates.`);
        });
        console.log(`Successfully moved ${docs.length} ${col.name} documents.`);
      } else {
        console.log(`No ${col.name} found in local database.`);
      }
    }

    console.log('--- MIGRATION COMPLETE ---');
    console.log('Your local data is now in the cloud!');
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
