import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
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
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
    billingDetails: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
      gstNumber: String,
    },
    sellerDetails: {
      name: String,
      companyName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      gstNumber: String,
      panNumber: String,
    },
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        tax: Number,
        total: Number,
      },
    ],
    pricing: {
      subtotal: Number,
      tax: Number,
      taxRate: Number,
      discount: Number,
      deliveryCharge: Number,
      total: Number,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    taxDetails: {
      cgst: Number,
      sgst: Number,
      igst: Number,
    },
    paymentDetails: {
      method: String,
      transactionId: String,
      paidAt: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'paid', 'cancelled'],
      default: 'draft',
    },
    dueDate: Date,
    paidAt: Date,
    notes: String,
    terms: String,
    downloadUrl: String,
    pdfGenerated: {
      type: Boolean,
      default: false,
    },
    sentToCustomer: {
      type: Boolean,
      default: false,
    },
    sentAt: Date,
  },
  {
    timestamps: true,
  }
);

// Generate invoice number before saving
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    this.invoiceNumber = `INV${year}${month}${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ order: 1 });
invoiceSchema.index({ user: 1 });
invoiceSchema.index({ seller: 1 });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ createdAt: -1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
