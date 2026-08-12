import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const initMongoConnection = async () => {
  try {
    // Trim env vars to avoid hidden trailing spaces
    const user = process.env.MONGODB_USER?.trim();
    const pass = process.env.MONGODB_PASSWORD?.trim();
    const host = process.env.MONGODB_URL?.trim();
    const dbName = process.env.MONGODB_DB?.trim();

    // Prefer full URI if provided (e.g. to bypass SRV DNS issues)
    const uriFromEnv = process.env.MONGODB_URI?.trim();
    const uri =
      uriFromEnv ||
      `mongodb+srv://${user}:${pass}@${host}/?retryWrites=true&w=majority&appName=Cluster0`;

    if (!user || !pass || !host || !dbName) {
      throw new Error("Missing MongoDB environment variables");
    }
    await mongoose.connect(uri, {
      dbName,
    });

    console.log("MongoDB is connected successfully!🎉");
  } catch (error) {
    console.error("Error connecting to MongoDB:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    process.exit(1);
  }
};
