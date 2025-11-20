// src/config/db.ts

import mongoose from "mongoose";
import logger from "../utils/logger";
import { config } from "./env";

export async function connectDB() {
  try {
    await mongoose.connect(config.mongodbUri);
    logger.info("MongoDB connected successfully");
  } catch (err: any) {
    logger.error("MongoDB connection error:", err.message || err);
    process.exit(1);
  }
}
