require('dotenv').config();

import { MongoClient } from "mongodb";
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDB() {
    await client.connect();
    console.log("Conectado a MongoDB");
    return client.db("edicionesalmeyda");
}

export default connectToDB;


