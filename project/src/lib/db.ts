import { connect, Connection } from "mongoose";
// 1. Sabse pehle global variable ko type-safe karein
declare global {
  var mongoose:
    | {
        conn: Connection | null;
        promise: Promise<Connection> | null;
      }
    | undefined;
}

const mongoDbUri = process.env.MONGODB_URI;
if (!mongoDbUri) {
  throw new Error("Please provide MONGODB_URI");
}

// 2. Cache ko safely initialize karein
let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

// 3. Database connection function
export const ConnectionDb = async (): Promise<Connection> => {
  if (cache.conn) {
    console.log("Cached database connection reused.");
    return cache.conn;
  }

  if (!cache.promise) {
    const opts = { bufferCommands: false };
    cache.promise = connect(mongoDbUri, opts).then((c) => c.connection);
  }

  try {
    cache.conn = await cache.promise;
    console.log("New database connection established.");
  } catch (error) {
    cache.promise = null; // Reset promise on error so subsequent requests can retry
    throw error;
  }

  return cache.conn;
};

export const connectionDb = ConnectionDb;
