import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeIntent,
  handleWebhook,
  processRefund,
  getPaymentStatus,
  getTransactionHistory,
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Razorpay routes
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

// Stripe routes
router.post('/stripe/create-intent', protect, createStripeIntent);

// Webhook routes (no auth required)
router.post('/webhook/:gateway', express.raw({ type: 'application/json' }), handleWebhook);

// Payment management
router.get('/status/:orderId', protect, getPaymentStatus);
router.get('/transactions', protect, getTransactionHistory);
router.post('/:id/refund', protect, isAdmin, processRefund);

export default router;
