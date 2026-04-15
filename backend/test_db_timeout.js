require('dotenv').config();
const { MongoClient } = require('mongodb');

const run = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection with 30s timeout...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 30000 });
  try {
    await client.connect();
    console.log('✅ Success!');
    await client.close();
  } catch (e) {
    console.log(`❌ Failed: ${e.message}`);
  }
  process.exit(0);
};

run();
