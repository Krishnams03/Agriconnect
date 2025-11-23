import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "your_mongodb_connection_string";
const options = {};

let client: MongoClient;
let db: Db;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

export async function connectToDatabase() {
  if (client && db) {
    return { client, db };
  }

  client = await MongoClient.connect(uri, options);
  db = client.db(); // Use the default database

  return { client, db };
}

// lib/mongodb.ts
import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connections[0].readyState) {
    return; // Already connected
  }

  await mongoose.connect(process.env.MONGODB_URI || 'your_mongodb_connection_string');
};

export default dbConnect;