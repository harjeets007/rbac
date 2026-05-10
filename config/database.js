const mongoose = require("mongoose");
require("dotenv").config();

const mongoUrl = process.env.MONGODB_URL;

const options = {
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  family: 4,
};

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl, options);
  } catch (error) {
    console.error("MongoDB initial connection error:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

const gracefulShutDown = async (signal) => {
  console.log(`\nReceived ${signal}. Closing MongoDB connection...`);
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed gracefully");
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error.message);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutDown("SIGINT"));
process.on("SIGTERM", () => gracefulShutDown("SIGTERM"));
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutDown("uncaughtException");
});

module.exports = connectDB;
