import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderType: {
      type: String,
      enum: ['car', 'part'],
      required: true,
    },
    // For car orders
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    // For part orders
    items: [
      {
        part: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Part',
        },
        name: String,
        price: Number,
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        subtotal: Number,
      },
    ],
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },
      tax: {
        type: Number,
        default: 0,
      },
      taxRate: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      deliveryCharge: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    currency: {
      type: String,
      default: 'INR',
    },
    shippingAddress: {
      name: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    billingAddress: {
      name: String,
      phone: String,
      email: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: {
        type: String,
        default: 'India',
      },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'partially-refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'cod', 'upi', 'bank-transfer'],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: String,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
    tracking: {
      carrier: String,
      trackingNumber: String,
      trackingUrl: String,
      estimatedDelivery: Date,
    },
    notes: {
      customer: String,
      internal: String,
    },
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
    },
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ seller: 1 });
orderSchema.index({ dealer: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
