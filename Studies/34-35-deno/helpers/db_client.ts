import {
    MongoClient,
    Database
  } from "https://deno.land/x/mongo@LATEST_VERSION/mod.ts";

let db: Database;

export function connectToDb() {
  const client = new MongoClient();
  const username = 'juliana';
  const password = 'ar6tE3vMlcpFT4OW';
  const databaseIWantToConnect = 'deno-todos';
  const connectionStringFromMongodbWebsiteCluster = `mongodb+srv://${username}:${password}@clusterbackend0.luzfp.mongodb.net?retryWrites=true&w=majority`;
  client.connectWithUri(connectionStringFromMongodbWebsiteCluster);
  db = client.database(databaseIWantToConnect); 
}

export function getDb() {
  return db;
}