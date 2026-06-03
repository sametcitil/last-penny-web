

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/lastpenny";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  lastFailureTime?: number;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseCache ?? { conn: null, promise: null, lastFailureTime: 0 };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

async function dbConnect(): Promise<any> {
  if (cached.conn) return cached.conn;

  // Yeni eklediğimiz yer burası:
  const mongooseModule = await import("mongoose");
  const mongoose = mongooseModule.default || mongooseModule;

  // Cool-off state kodların aynen devam ediyor...
  
  // Cool-off state: If connection failed in the last 30 seconds, fail immediately without trying
  const now = Date.now();
  const lastFailure = cached.lastFailureTime || 0;
  if (now - lastFailure < 30000) {
    throw new Error("MongoDB connection in cool-off state due to recent failure (IP whitelist issue?).");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2000, // Fail after 2 seconds instead of 30 seconds
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.lastFailureTime = Date.now();
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
