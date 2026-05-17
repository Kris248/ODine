import dotenv from "dotenv";

dotenv.config({ path: new URL("../../../.env", import.meta.url) });

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/odine",
  jwtSecret: process.env.JWT_SECRET || "replace-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  customerAppUrl: process.env.CLIENT_URL_CUSTOMER || "http://localhost:5174",
  mockPaymentProvider: process.env.MOCK_PAYMENT_PROVIDER || "mockpay",
  mockPaymentWebhookSecret:
    process.env.MOCK_PAYMENT_WEBHOOK_SECRET || "odine-mock-webhook-secret",
  allowedOrigins: [
    process.env.CLIENT_URL_ADMIN || "http://localhost:5173",
    "http://192.168.1.6:5173",
    process.env.CLIENT_URL_CUSTOMER || "http://localhost:5174",
    "http://192.168.1.6:5174",
    process.env.CLIENT_URL_KDS || "http://localhost:5175",
    "http://192.168.1.6:5175"
  ]
};
