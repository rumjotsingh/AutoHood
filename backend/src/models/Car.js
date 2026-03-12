import mongoose from 'mongoose';
import slugify from 'slugify';

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide car title'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Please provide brand'],
    },
    model: {
      type: String,
      required: [true, 'Please provide model'],
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide manufacturing year'],
      min: [1900, 'Year must be after 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: Number,
    negotiable: {
      type: Boolean,
      default: true,
    },
    condition: {
      type: String,
      enum: ['new', 'used', 'certified'],
      default: 'used',
    },
    mileage: {
      type: Number,
      required: [true, 'Please provide mileage'],
      min: [0, 'Mileage cannot be negative'],
    },
    kmDriven: {
      type: Number,
      default: 0,
      min: [0, 'KM driven cannot be negative'],
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng', 'lpg'],
      required: [true, 'Please provide fuel type'],
    },
    transmission: {
      type: String,
      enum: ['manual', 'automatic', 'semi-automatic'],
      required: [true, 'Please provide transmission type'],
    },
    bodyType: {
      type: String,
      enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'wagon', 'van', 'truck', 'sports'],
      required: [true, 'Please provide body type'],
    },
    color: {
      type: String,
      required: [true, 'Please provide color'],
    },
    seats: {
      type: Number,
      min: [2, 'Minimum 2 seats required'],
      max: [20, 'Maximum 20 seats allowed'],
    },
    doors: {
      type: Number,
      min: [2, 'Minimum 2 doors required'],
      max: [6, 'Maximum 6 doors allowed'],
    },
    engineCapacity: {
      type: Number,
      min: [0, 'Engine capacity cannot be negative'],
    },
    power: {
      type: Number,
      min: [0, 'Power cannot be negative'],
    },
    torque: {
      type: Number,
      min: [0, 'Torque cannot be negative'],
    },
    owners: {
      type: Number,
      default: 1,
      min: [0, 'Owners cannot be negative'],
    },
    registrationNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    registrationState: String,
    registrationYear: Number,
    insuranceType: {
      type: String,
      enum: ['comprehensive', 'third-party', 'expired', 'none'],
    },
    insuranceValidity: Date,
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    location: {
      address: String,
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      state: {
        type: String,
        required: [true, 'Please provide state'],
      },
      pincode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'pending', 'inactive', 'rejected'],
      default: 'pending',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
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
    stats: {
      views: {
        type: Number,
        default: 0,
      },
      inquiries: {
        type: Number,
        default: 0,
      },
      testDrives: {
        type: Number,
        default: 0,
      },
      wishlistCount: {
        type: Number,
        default: 0,
      },
    },
    soldAt: Date,
    soldPrice: Number,
    expiresAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
carSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'car',
  justOne: false,
});

// Create slug before saving
carSchema.pre('save', function (next) {
  if (this.isModified('title') || this.isModified('model') || this.isModified('year')) {
    this.slug = slugify(`${this.title}-${this.model}-${this.year}`, {
      lower: true,
      strict: true,
    }) + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Indexes for better query performance
carSchema.index({ brand: 1, model: 1 });
carSchema.index({ price: 1 });
carSchema.index({ year: -1 });
carSchema.index({ fuelType: 1 });
carSchema.index({ transmission: 1 });
carSchema.index({ bodyType: 1 });
carSchema.index({ 'location.city': 1 });
carSchema.index({ 'location.state': 1 });
carSchema.index({ status: 1 });
carSchema.index({ featured: -1 });
carSchema.index({ createdAt: -1 });
carSchema.index({ slug: 1 });
carSchema.index({ owner: 1 });
carSchema.index({ dealer: 1 });

// Text index for search
carSchema.index({
  title: 'text',
  model: 'text',
  description: 'text',
});

const Car = mongoose.model('Car', carSchema);

export default Car;
