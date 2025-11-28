const path = require("path");
const dotenv = require("dotenv");

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const requiredEnvVars = ["JWT_SECRET", "MONGODB_URI"];
const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(", ")}\n` +
      "Create a .env file (which stays outside version control) and populate the keys above."
  );
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  frontendUrl: process.env.FRONTEND_URL || "*",
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  tokenExpirySeconds: Number(process.env.JWT_EXPIRES_IN) || 3600,
  logLevel: process.env.LOG_LEVEL || "info",
  apiKeys: {
    trefle: process.env.TREFLE_API_KEY,
    plantNet: process.env.PLANTNET_API_KEY,
  },
};

module.exports = config;
