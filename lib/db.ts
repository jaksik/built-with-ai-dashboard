import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface CustomGlobal extends Global {
  mongoose?: GlobalMongoose;
}

declare const global: CustomGlobal;

let cached = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    try {
      console.log('Attempting to connect to MongoDB...');
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('Successfully connected to MongoDB');
        return mongoose;
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error('MongoDB connection error details:', {
        message: err.message,
        name: err.name
      });
      throw error;
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error establishing MongoDB connection:', {
      message: err.message,
      name: err.name
    });
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}