const { MongoClient } = require('mongodb');

const run = async () => {
  const user = 'reddyeswar47226_db_user';
  const pass = encodeURIComponent('Reddy@123');
  const hosts = [
    'ac-cise5fn-shard-00-00.xkukkg1.mongodb.net:27017',
    'ac-cise5fn-shard-00-01.xkukkg1.mongodb.net:27017',
    'ac-cise5fn-shard-00-02.xkukkg1.mongodb.net:27017'
  ];
  
  const uri = `mongodb://${user}:${pass}@${hosts.join(',')}/tradeverse?ssl=true&replicaSet=atlas-9x0x8l-shard-0&authSource=admin&retryWrites=true&w=majority`;
  
  console.log('Testing Standard Connection String (bypass SRV)...');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    console.log('✅ Standard Connection worked!');
    await client.close();
  } catch (e) {
    console.log(`❌ Standard Connection failed: ${e.message}`);
  }
  process.exit(0);
};

run();
