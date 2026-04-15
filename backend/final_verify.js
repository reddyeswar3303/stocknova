require('dotenv').config();
const { MongoClient } = require('mongodb');

const run = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('Final Verification of MongoDB Atlas Connection...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });
  try {
    await client.connect();
    console.log('✅ MongoDB Atlas Connected Successfully!');
    // Try to list databases to confirm permissions
    const dbs = await client.db().admin().listDatabases();
    console.log('✅ Permissions Verified. Databases:', dbs.databases.map(db => db.name).join(', '));
    await client.close();
    process.exit(0);
  } catch (e) {
    console.log(`❌ Connection Failed: ${e.message}`);
    process.exit(1);
  }
};

run();
