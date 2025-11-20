// src/config/env.ts

import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || "6060",

  mongodbUri:
    process.env.MONGODB_URI || "" ,

  githubToken: process.env.GITHUB_TOKEN || "",

  googleProjectId: process.env.GOOGLE_PROJECT_ID || "",
  googleLocation: process.env.GOOGLE_LOCATION || "global",
  googleApiKey: process.env.GOOGLE_API_KEY || "",

  env: process.env.NODE_ENV || "development",
};
