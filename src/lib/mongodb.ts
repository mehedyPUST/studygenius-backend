import { MongoClient, Db } from 'mongodb';
import { env } from '../config/env';

let client: MongoClient | undefined;
let db: Db | undefined;

export async function getDb(): Promise<Db> {
  if (db) return db;

  client = new MongoClient(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });

  await client.connect();
  db = client.db(env.MONGODB_DB_NAME);
  console.log('Connected to MongoDB');
  return db;
}

export async function closeDb(): Promise<void> {
  await client?.close();
  client = undefined;
  db = undefined;
}
