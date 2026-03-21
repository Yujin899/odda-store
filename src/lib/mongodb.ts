import mongoose from 'mongoose';
import dns from "node:dns/promises";

dns.setServers(["8.8.8.8"]);

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connects to MongoDB Atlas using a cached singleton connection.
 * 
 * Must be called as the FIRST line in every API route handler.
 * Uses connection pooling (maxPoolSize: 10) for Vercel serverless survival.
 * Safe to call multiple times — returns cached connection if already connected.
 * 
 * @throws Error if MONGODB_URI environment variable is not set
 */
export async function connectDB() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached!.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => {
      console.log('New MongoDB connection established (Pool Size: 10)');
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached!.conn;
}