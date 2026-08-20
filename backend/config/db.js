import mongoose from "mongoose";

let dbStatus = {
  connected: false,
  message: "Database not connected",
  error: null,
};

const connectDB = async (retries = 5, delay = 5000) => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    dbStatus = {
      connected: false,
      message: "MONGODB_URI is not defined",
      error: "MONGODB_URI is not defined in environment variables",
    };

    console.error("❌ MONGODB_URI is not defined");

    return dbStatus;
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      dbStatus = {
        connected: true,
        message: "MongoDB connected successfully",
        error: null,
      };

      console.log("✅ MongoDB connected successfully");

      return dbStatus;
    } catch (error) {
      dbStatus = {
        connected: false,
        message: "MongoDB connection failed",
        error: error.message,
      };

      console.error(
        `❌ MongoDB Connection Error (Attempt ${attempt}/${retries}):`,
        error.message
      );

      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return dbStatus;
};

export const getDBStatus = () => dbStatus;

export default connectDB;