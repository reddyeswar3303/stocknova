require('dotenv').config();
const { MongoClient } = require('mongodb');

const test = async (uri, label) => {
  console.log(`Testing ${label}...`);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log(`✅ ${label} worked!`);
    await client.close();
    return true;
  } catch (e) {
    console.log(`❌ ${label} failed: ${e.message}`);
    return false;
  }
};

const run = async () => {
  const pass = 'Reddy@123';
  const user = 'reddyeswar47226_db_user';
  const cluster = 'cluster0.xkukkg1.mongodb.net';
  
  const uriEncoded = `mongodb+srv://${user}:${encodeURIComponent(pass)}@${cluster}/tradeverse?retryWrites=true&w=majority&appName=Cluster0`;
  const uriPlain = `mongodb+srv://${user}:${pass}@${cluster}/tradeverse?retryWrites=true&w=majority&appName=Cluster0`;

  await test(uriEncoded, 'Encoded Password');
  await test(uriPlain, 'Plain Password');
  process.exit(0);
};

run();
