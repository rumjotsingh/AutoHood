import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import 'colors';

// Load environment variables FIRST
dotenv.config();

// Import configurations
import connectDB from './src/config/db.js';
import connectRedis from './src/config/redis.js';
import './src/config/cloudinary.js'; // Initialize Cloudinary after env vars loaded

// Import middleware
import { errorHandler, notFound } from './src/middlewares/errorMiddleware.js';

// Import routes
import authRoutes from './src/routes/authRoutes.js';
import carRoutes from './src/routes/carRoutes.js';
import paymentRoutes from './src/routes/paymentRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import brandRoutes from './src/routes/brandRoutes.js';
import dealerRoutes from './src/routes/dealerRoutes.js';
import partRoutes from './src/routes/partRoutes.js';
import orderRoutes from './src/routes/orderRoutes.js';
import reviewRoutes from './src/routes/reviewRoutes.js';
import testDriveRoutes from './src/routes/testDriveRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import bookingRoutes from './src/routes/bookingRoutes.js';
import contactRoutes from './src/routes/contactRoutes.js';

// Initialize Express app
const app = express();

// Connect to Database
connectDB();

// Connect to Redis (optional)
if (process.env.REDIS_ENABLED === 'true') {
  connectRedis();
}

// ============ MIDDLEWARE ============

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

// CORS
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL,
    process.env.FRONTEND_PROD_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Sanitize data
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ============ ROUTES ============

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'AutoHood API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/dealers', dealerRoutes);
app.use('/api/v1/parts', partRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/test-drives', testDriveRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/contact', contactRoutes);

// ============ ERROR HANDLING ============

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// ============ SERVER ============

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚗  AutoHood API Server v2.0.0                         ║
║                                                           ║
║   🌐  Server running on port ${PORT}                        ║
║   📊  Environment: ${process.env.NODE_ENV?.toUpperCase().padEnd(11)}                      ║
║   🔗  API: http://localhost:${PORT}/api                     ║
║   ✅  Health: http://localhost:${PORT}/api/health           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `.cyan);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

export default app;
