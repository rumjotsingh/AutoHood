import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: true,
    },
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
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    gateway: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'cod', 'upi', 'bank-transfer'],
      required: true,
    },
    type: {
      type: String,
      enum: ['payment', 'refund', 'chargeback'],
      default: 'payment',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    refundStatus: {
      type: String,
      enum: ['none', 'pending', 'processing', 'completed', 'failed'],
      default: 'none',
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundId: String,
    refundReason: String,
    refundedAt: Date,
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    errorCode: String,
    errorMessage: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
transactionSchema.index({ payment: 1 });
transactionSchema.index({ order: 1 });
transactionSchema.index({ user: 1 });
transactionSchema.index({ transactionId: 1 });
transactionSchema.index({ gateway: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
