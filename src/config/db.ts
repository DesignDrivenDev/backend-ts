import mongoose from "mongoose";
import { config } from "./config";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connect to database successfully");
    });
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
    mongoose.connection.on("error", (error) => {
      console.log(`Database error: ${error}`);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    console.log(`Failed to connect to Databases: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
