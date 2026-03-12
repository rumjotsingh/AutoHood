import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
    carPrice: {
      type: Number,
      required: true,
    },
    bookingAmount: {
      type: Number,
      required: true,
    },
    remainingAmount: {
      type: Number,
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: String,
    razorpaySignature: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    customerDetails: {
      name: String,
      email: String,
      phone: String,
    },
    notes: {
      customer: String,
      seller: String,
      internal: String,
    },
    offlinePaymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending',
    },
    offlinePaymentDetails: {
      amountPaid: {
        type: Number,
        default: 0,
      },
      paymentMode: String,
      transactionRef: String,
      paidAt: Date,
    },
    confirmedAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate booking number before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BKG${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ seller: 1 });
bookingSchema.index({ car: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
