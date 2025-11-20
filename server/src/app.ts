// src/app.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env";
import { connectDB } from "./config/db";

import githubRoutes from "./modules/github/github.routes";
import reviewRoutes from "./modules/review/review.routes";
import { errorHandler } from "./utils/errorHandler";
import logger from "./utils/logger";

const app = express();

// -----------------------------
//  Middleware
// -----------------------------
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// -----------------------------
//  Routes
// -----------------------------
app.use("/api/github", githubRoutes);
app.use("/api/review", reviewRoutes);

// -----------------------------
//  Error Middleware
// -----------------------------
app.use(errorHandler);

// -----------------------------
//  Start Function
// -----------------------------
async function startServer() {
  try {
    // Connect DB
    await connectDB();

    // Start server
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });

  } catch (err: any) {
    logger.error("Startup error: " + (err.message || err));
    process.exit(1);
  }
}

startServer();

export default app;
