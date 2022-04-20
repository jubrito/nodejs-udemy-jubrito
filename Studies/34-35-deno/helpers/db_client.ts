import {
    MongoClient,
    Database
  } from "https://deno.land/x/mongo@v0.29.3/mod.ts";

let db: Database;

export async function connectToDb() {
  const client = new MongoClient();
  const username = 'jubrito';
  const password = 'MS6HwYNd2pFsbkuX';
  const databaseIWantToConnect = 'deno-todos';
  const connectionStringFromMongodbWebsiteCluster = `mongodb+srv://${username}:${password}@clusterbackend0.luzfp.mongodb.net?authMechanism=SCRAM-SHA-1`;
  await client.connect(connectionStringFromMongodbWebsiteCluster);
  db = client.database(databaseIWantToConnect); 
}

export function getDb() {
  return db;
}