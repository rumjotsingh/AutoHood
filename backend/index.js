import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

// Route imports
import userRoutes from "./routes/user.routes.js";
import carRoutes from "./routes/carListing.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import feedbackesRoutes from "./routes/feedback.routes.js";
import PaymentRoutes from "./routes/Payment.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import inquiryRoutes from "./routes/inquiry.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import searchRoutes from "./routes/search.routes.js";

// Security middleware imports
import {
  generalLimiter,
  authLimiter,
  apiLimiter,
  paymentLimiter,
  securityHeaders,
  sanitizeInput,
  requestLogger,
  errorHandler,
  corsOptions,
} from "./security.js";

dotenv.config();
const app = express();

// ============ Security Middleware ============
// Helmet for security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false, // We'll use our custom CSP
  })
);

// CORS configuration
app.use(cors(corsOptions));

// Custom security headers
app.use(securityHeaders);

// Request compression
app.use(compression());

// Request logging
app.use(requestLogger);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Input sanitization
app.use(sanitizeInput);

// Static files
app.use("/uploads", express.static("uploads"));

// General rate limiting
app.use(generalLimiter);

// ============ Database Connection ============
main()
  .then(() => {
    console.log("✅ Connected to Database");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL, {
    // These options are deprecated in newer mongoose but good for older versions
  });
}

// ============ API Routes ============
// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AutoHood API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Auth routes (with stricter rate limiting)
app.use("/api/v1/auth", authLimiter, userRoutes);

// Car routes
app.use("/api/v1/cars", apiLimiter, carRoutes);

// Review routes
app.use("/api/v1/reviews", apiLimiter, reviewRoutes);

// Feedback routes
app.use("/api/v1/feedbacks", apiLimiter, feedbackesRoutes);

// Payment routes (with payment-specific rate limiting)
app.use("/api/v1/stripe", paymentLimiter, PaymentRoutes);

// Favorites routes
app.use("/api/v1/favorites", apiLimiter, favoriteRoutes);

// Inquiry/Messaging routes
app.use("/api/v1/inquiries", apiLimiter, inquiryRoutes);

// Analytics routes
app.use("/api/v1/analytics", apiLimiter, analyticsRoutes);

// Advanced search routes
app.use("/api/v1/search", apiLimiter, searchRoutes);

// ============ Error Handling ============
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// ============ Server Start ============
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 AutoHood Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  mongoose.connection.close();
  process.exit(0);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
