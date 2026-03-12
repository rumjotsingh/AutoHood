import mongoose from 'mongoose';
import slugify from 'slugify';

const partSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide part name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: [true, 'Please provide category'],
      enum: [
        'engine',
        'transmission',
        'brakes',
        'suspension',
        'electrical',
        'body',
        'interior',
        'exterior',
        'wheels',
        'lighting',
        'cooling',
        'exhaust',
        'fuel-system',
        'steering',
        'other',
      ],
    },
    subcategory: String,
    description: {
      type: String,
      required: [true, 'Please provide description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: Number,
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    stock: {
      type: Number,
      required: [true, 'Please provide stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    sku: {
      type: String,
      unique: true,
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    partNumber: String,
    condition: {
      type: String,
      enum: ['new', 'refurbished', 'used'],
      default: 'new',
    },
    warranty: {
      available: {
        type: Boolean,
        default: false,
      },
      duration: Number, // in months
      description: String,
    },
    compatibility: [
      {
        brand: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Brand',
        },
        models: [String],
        years: [Number],
      },
    ],
    specifications: {
      type: Map,
      of: String,
    },
    images: [
      {
        public_id: String,
        url: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
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
      sold: {
        type: Number,
        default: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

// Create slug before saving
partSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + this._id.toString().slice(-6);
  }
  next();
});

// Indexes
partSchema.index({ category: 1 });
partSchema.index({ price: 1 });
partSchema.index({ brand: 1 });
partSchema.index({ seller: 1 });
partSchema.index({ isActive: 1 });
partSchema.index({ isFeatured: -1 });
partSchema.index({ 'rating.average': -1 });
partSchema.index({ slug: 1 });
partSchema.index({ sku: 1 });

// Text search
partSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
});

const Part = mongoose.model('Part', partSchema);

export default Part;
