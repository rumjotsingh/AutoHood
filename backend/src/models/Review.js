import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewType: {
      type: String,
      enum: ['car', 'part', 'dealer'],
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
    },
    part: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Part',
    },
    dealer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dealer',
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    helpfulBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reviewSchema.index({ car: 1 });
reviewSchema.index({ part: 1 });
reviewSchema.index({ dealer: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });

// Ensure user can only review once per item
reviewSchema.index({ user: 1, car: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, part: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, dealer: 1 }, { unique: true, sparse: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
