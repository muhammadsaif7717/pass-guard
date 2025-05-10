import { Db, MongoClient, ServerApiVersion } from "mongodb";

let client: MongoClient;
let db: Db;

export const connectDB = async () => {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const dbName = process.env.DB_NAME;
  if (!dbName) {
    throw new Error("Please define the DB_NAME environment variable");
  }

  try {
     client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    db = client.db(dbName);

    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Failed to connect to the database");
  }
};
