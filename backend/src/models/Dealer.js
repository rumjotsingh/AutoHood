import mongoose from 'mongoose';

const dealerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['individual', 'dealership', 'showroom', 'manufacturer'],
      default: 'dealership',
    },
    gstNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    location: {
      address: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    alternatePhone: String,
    website: String,
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    logo: {
      public_id: String,
      url: String,
    },
    documents: [
      {
        type: {
          type: String,
          enum: ['gst', 'pan', 'license', 'registration', 'other'],
        },
        public_id: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    subscription: {
      plan: {
        type: String,
        enum: ['none', 'basic', 'premium', 'enterprise'],
        default: 'none',
      },
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'pending',
      },
      startDate: Date,
      endDate: Date,
      autoRenew: {
        type: Boolean,
        default: false,
      },
      listingLimit: {
        type: Number,
        default: 0,
      },
      currentListings: {
        type: Number,
        default: 0,
      },
    },
    stats: {
      totalListings: {
        type: Number,
        default: 0,
      },
      activeListings: {
        type: Number,
        default: 0,
      },
      soldCars: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      totalViews: {
        type: Number,
        default: 0,
      },
      totalInquiries: {
        type: Number,
        default: 0,
      },
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
    },
    workingHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
dealerSchema.index({ user: 1 });
dealerSchema.index({ 'location.city': 1 });
dealerSchema.index({ 'location.state': 1 });
dealerSchema.index({ verified: 1 });
dealerSchema.index({ 'subscription.status': 1 });
dealerSchema.index({ 'rating.average': -1 });
dealerSchema.index({ isActive: 1 });

const Dealer = mongoose.model('Dealer', dealerSchema);

export default Dealer;
