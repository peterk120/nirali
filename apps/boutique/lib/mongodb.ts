import mongoose from "mongoose";

/**
 * Extend global type for cached connection
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ Please define the MONGODB_URI environment variable in Vercel or .env.local"
  );
}

/**
 * Create global cache (prevents multiple DB connections)
 */
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

async function connectToDatabase() {
  // ✅ Use cached connection
  if (cached!.conn) {
    console.log("♻️ Using cached MongoDB connection");
    return cached!.conn;
  }

  // ✅ Create new connection if not exists
  if (!cached!.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,

      // Optimized for Vercel Serverless
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Prefer IPv4
    };

    console.log(
      `🔌 Connecting to MongoDB (${process.env.NODE_ENV || "development"})...`
    );

    cached!.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Error:", error);
        throw error;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;