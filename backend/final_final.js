const { MongoClient } = require('mongodb');

const run = async () => {
  const uri = "mongodb+srv://reddyeswar47226_db_user:Reddy%40123@cluster0.xkukkg1.mongodb.net/tradeverse?retryWrites=true&w=majority&appName=Cluster0";
  console.log('Last attempt with extended timeouts...');
  const client = new MongoClient(uri, { 
    serverSelectionTimeoutMS: 20000,
    connectTimeoutMS: 20000,
  });
  try {
    await client.connect();
    console.log('✅ Success!');
    await client.close();
  } catch (e) {
    console.log(`❌ Error: ${e.message}`);
    if (e.message.includes('ECONNRESET') || e.message.includes('timeout')) {
        console.log('TIP: Your ProtonVPN might be blocking the database handshake.');
    }
  }
  process.exit(0);
};

run();
