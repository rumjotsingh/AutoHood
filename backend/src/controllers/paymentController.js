import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Razorpay from 'razorpay';
import Stripe from 'stripe';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Transaction from '../models/Transaction.js';
import Invoice from '../models/Invoice.js';

// Initialize payment gateways
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// @desc    Create Razorpay order
// @route   POST /api/v1/payments/razorpay/create-order
// @access  Private
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  const amountInPaise = Math.round(order.pricing.total * 100);

  // Demo mode check
  const MAX_AMOUNT_PAISE = 5000000; // ₹50,000
  const DEMO_MODE = process.env.PAYMENT_DEMO_MODE === 'true';

  if (DEMO_MODE && amountInPaise > MAX_AMOUNT_PAISE) {
    return res.json({
      success: true,
      demoMode: true,
      orderId: `demo_order_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  }

  const options = {
    amount: amountInPaise,
    currency: order.currency || 'INR',
    receipt: `rcpt_${order.orderNumber}`,
    notes: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
  };

  const razorpayOrder = await razorpay.orders.create(options);

  // Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: req.user.id,
    gateway: 'razorpay',
    amount: order.pricing.total,
    currency: order.currency,
    gatewayOrderId: razorpayOrder.id,
    razorpay: {
      orderId: razorpayOrder.id,
    },
  });

  order.payment = payment._id;
  order.paymentMethod = 'razorpay';
  await order.save();

  res.json({
    success: true,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    paymentId: payment._id,
  });
});

// @desc    Verify Razorpay payment
// @route   POST /api/v1/payments/razorpay/verify
// @access  Private
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto
    .createHash('sha256')
    .update(sign)
    .digest('hex');

  if (razorpay_signature !== expectedSign) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature',
    });
  }

  // Find payment
  const payment = await Payment.findOne({ gatewayOrderId: razorpay_order_id });

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  // Update payment
  payment.status = 'completed';
  payment.gatewayPaymentId = razorpay_payment_id;
  payment.gatewaySignature = razorpay_signature;
  payment.razorpay.paymentId = razorpay_payment_id;
  payment.razorpay.signature = razorpay_signature;
  payment.paidAt = Date.now();
  await payment.save();

  // Update order
  const order = await Order.findById(payment.order);
  order.paymentStatus = 'completed';
  order.orderStatus = 'confirmed';
  order.statusHistory.push({
    status: 'confirmed',
    note: 'Payment completed successfully',
    timestamp: Date.now(),
  });
  await order.save();

  // Create transaction
  await Transaction.create({
    payment: payment._id,
    order: order._id,
    user: payment.user,
    transactionId: razorpay_payment_id,
    gateway: 'razorpay',
    type: 'payment',
    amount: payment.amount,
    currency: payment.currency,
    status: 'completed',
    gatewayResponse: req.body,
  });

  // Generate invoice
  await generateInvoice(order._id);

  res.json({
    success: true,
    message: 'Payment verified successfully',
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });
});

// @desc    Create Stripe payment intent
// @route   POST /api/v1/payments/stripe/create-intent
// @access  Private
export const createStripeIntent = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  const amountInCents = Math.round(order.pricing.total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: order.currency.toLowerCase() || 'inr',
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
  });

  // Create payment record
  const payment = await Payment.create({
    order: order._id,
    user: req.user.id,
    gateway: 'stripe',
    amount: order.pricing.total,
    currency: order.currency,
    gatewayOrderId: paymentIntent.id,
    stripe: {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    },
  });

  order.payment = payment._id;
  order.paymentMethod = 'stripe';
  await order.save();

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
    paymentId: payment._id,
  });
});

// @desc    Handle payment webhook
// @route   POST /api/v1/payments/webhook/:gateway
// @access  Public
export const handleWebhook = asyncHandler(async (req, res) => {
  const { gateway } = req.params;

  if (gateway === 'razorpay') {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (signature === expectedSignature) {
      const event = req.body.event;
      const payload = req.body.payload.payment.entity;

      if (event === 'payment.captured') {
        // Handle successful payment
        const payment = await Payment.findOne({ gatewayPaymentId: payload.id });
        if (payment && payment.status !== 'completed') {
          payment.status = 'completed';
          payment.paidAt = Date.now();
          await payment.save();

          const order = await Order.findById(payment.order);
          order.paymentStatus = 'completed';
          order.orderStatus = 'confirmed';
          await order.save();
        }
      }
    }
  } else if (gateway === 'stripe') {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        const payment = await Payment.findOne({ gatewayOrderId: paymentIntent.id });
        if (payment && payment.status !== 'completed') {
          payment.status = 'completed';
          payment.gatewayPaymentId = paymentIntent.id;
          payment.paidAt = Date.now();
          await payment.save();

          const order = await Order.findById(payment.order);
          order.paymentStatus = 'completed';
          order.orderStatus = 'confirmed';
          await order.save();
        }
      }
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  res.json({ received: true });
});

// @desc    Process refund
// @route   POST /api/v1/payments/:id/refund
// @access  Private (Admin)
export const processRefund = asyncHandler(async (req, res) => {
  const { reason, amount } = req.body;

  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
  }

  const refundAmount = amount || payment.amount;

  let refund;

  if (payment.gateway === 'razorpay') {
    refund = await razorpay.payments.refund(payment.gatewayPaymentId, {
      amount: Math.round(refundAmount * 100),
      notes: { reason },
    });

    payment.refund = {
      status: 'completed',
      amount: refundAmount,
      reason,
      refundId: refund.id,
      processedAt: Date.now(),
      processedBy: req.user.id,
    };
  } else if (payment.gateway === 'stripe') {
    refund = await stripe.refunds.create({
      payment_intent: payment.gatewayOrderId,
      amount: Math.round(refundAmount * 100),
      reason: 'requested_by_customer',
    });

    payment.refund = {
      status: 'completed',
      amount: refundAmount,
      reason,
      refundId: refund.id,
      processedAt: Date.now(),
      processedBy: req.user.id,
    };
  }

  payment.status = refundAmount === payment.amount ? 'refunded' : 'partially-refunded';
  await payment.save();

  // Update order
  const order = await Order.findById(payment.order);
  order.paymentStatus = payment.status;
  await order.save();

  // Create refund transaction
  await Transaction.create({
    payment: payment._id,
    order: order._id,
    user: payment.user,
    transactionId: refund.id,
    gateway: payment.gateway,
    type: 'refund',
    amount: refundAmount,
    currency: payment.currency,
    status: 'completed',
    refundStatus: 'completed',
    refundAmount,
    refundReason: reason,
    refundedAt: Date.now(),
  });

  res.json({
    success: true,
    message: 'Refund processed successfully',
    data: payment,
  });
});

// @desc    Get payment status
// @route   GET /api/v1/payments/status/:orderId
// @access  Private
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('payment');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  res.json({
    success: true,
    data: {
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      payment: order.payment,
    },
  });
});

// @desc    Get transaction history
// @route   GET /api/v1/payments/transactions
// @access  Private
export const getTransactionHistory = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user.id })
    .populate('order', 'orderNumber pricing')
    .sort('-createdAt')
    .limit(50);

  res.json({
    success: true,
    data: transactions,
  });
});

// Helper function to generate invoice
const generateInvoice = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate('user')
    .populate('seller')
    .populate('dealer');

  const invoice = await Invoice.create({
    order: order._id,
    user: order.user._id,
    seller: order.seller,
    dealer: order.dealer,
    billingDetails: order.billingAddress,
    items: order.items,
    pricing: order.pricing,
    currency: order.currency,
    paymentDetails: {
      method: order.paymentMethod,
      paidAt: Date.now(),
    },
    status: 'paid',
    paidAt: Date.now(),
  });

  order.invoice = invoice._id;
  await order.save();

  return invoice;
};

export default {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeIntent,
  handleWebhook,
  processRefund,
  getPaymentStatus,
  getTransactionHistory,
};
