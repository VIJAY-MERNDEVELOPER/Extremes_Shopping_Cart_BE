import mongoose from "mongoose";

export function dbConnection() {
  const MONGO_URL = process.env.MONGO_URL;

  try {
    mongoose.connect(MONGO_URL);
    console.log("Database connected");
    return;
  } catch (error) {
    console.log(`MongoDb connection failed: ${error}`);
    return;
  }
}
