const mongoose = require('mongoose');
const MongoClient = mongoose.mongo.MongoClient;
const path = require('path');
const fs = require('fs');

// Try to load env variables from .env or .env.local if present
const envPaths = ['.env.local', '.env'];
for (const envPath of envPaths) {
  const fullPath = path.join(process.cwd(), envPath);
  if (fs.existsSync(fullPath)) {
    require('dotenv').config({ path: fullPath });
    console.log(`Loaded environment variables from ${envPath}`);
    break;
  }
}

// Atlas URI (source) - can be passed as argument or read from env
let ATLAS_URI = process.argv[2] || process.env.MONGODB_URI;
// Local URI (target)
const LOCAL_URI = process.env.LOCAL_MONGODB_URI || "mongodb://localhost:27017/lastpenny";

if (!ATLAS_URI) {
  console.error("\n❌ Error: MongoDB Atlas Connection URI is missing!");
  console.log("\nUsage:");
  console.log("  node scripts/pull-db.js <ATLAS_CONNECTION_STRING>");
  console.log("\nOr define MONGODB_URI in your .env.local file.");
  process.exit(1);
}

if (ATLAS_URI.includes("localhost") || ATLAS_URI.includes("127.0.0.1")) {
  console.warn("⚠️ Warning: ATLAS_URI looks like a local URI. Make sure it points to your MongoDB Atlas cluster!");
}

async function run() {
  console.log("Connecting to source (Atlas) and target (Local) databases...");
  
  const sourceClient = new MongoClient(ATLAS_URI);
  const targetClient = new MongoClient(LOCAL_URI);

  try {
    await sourceClient.connect();
    await targetClient.connect();
    console.log("✅ Successfully connected to both databases.");

    // Retrieve database names
    const sourceDbName = sourceClient.db().databaseName || "lastpenny";
    const targetDbName = targetClient.db().databaseName || "lastpenny";

    console.log(`\nSource Database (Atlas): ${sourceDbName}`);
    console.log(`Target Database (Local): ${targetDbName}\n`);

    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db(targetDbName);

    const collections = await sourceDb.listCollections().toArray();

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName.startsWith("system.")) continue;

      console.log(`🔄 Copying collection: ${colName}...`);
      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      // Clean local collection first to avoid duplicates
      await targetCol.deleteMany({});

      const documents = await sourceCol.find({}).toArray();
      if (documents.length > 0) {
        await targetCol.insertMany(documents);
        console.log(`   └─ Copied ${documents.length} documents.`);
      } else {
        console.log(`   └─ Collection is empty, skipped.`);
      }
    }
    console.log("\n🎉 Database successfully pulled to your local computer!");
  } catch (error) {
    console.error("\n❌ Error during migration:", error);
  } finally {
    await sourceClient.close();
    await targetClient.close();
  }
}

run();
