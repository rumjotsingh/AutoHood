import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'cod', 'upi', 'bank-transfer'],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        'credit-card',
        'debit-card',
        'upi',
        'net-banking',
        'wallet',
        'emi',
        'bnpl',
        'cod',
        'bank-transfer',
      ],
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending',
    },
    // Gateway specific IDs
    gatewayOrderId: String,
    gatewayPaymentId: String,
    gatewaySignature: String,
    // Razorpay
    razorpay: {
      orderId: String,
      paymentId: String,
      signature: String,
    },
    // Stripe
    stripe: {
      paymentIntentId: String,
      clientSecret: String,
    },
    // PayPal
    paypal: {
      orderId: String,
      payerId: String,
      paymentId: String,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    refund: {
      status: {
        type: String,
        enum: ['none', 'pending', 'processing', 'completed', 'failed'],
        default: 'none',
      },
      amount: {
        type: Number,
        default: 0,
      },
      reason: String,
      refundId: String,
      requestedAt: Date,
      processedAt: Date,
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    failureReason: String,
    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ gateway: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ gatewayPaymentId: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
