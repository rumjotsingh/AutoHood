import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    carTitle: String,
    status: {
      type: String,
      enum: ['pending', 'contacted', 'resolved', 'closed'],
      default: 'pending',
    },
    dealerResponse: String,
    respondedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
contactSchema.index({ user: 1 });
contactSchema.index({ dealer: 1 });
contactSchema.index({ car: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
