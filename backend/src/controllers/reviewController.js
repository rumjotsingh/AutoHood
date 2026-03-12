import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Review from '../models/Review.js';
import Car from '../models/Car.js';
import Part from '../models/Part.js';
import Dealer from '../models/Dealer.js';

// @desc    Create review
// @route   POST /api/v1/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { reviewType, car, part, dealer, rating, title, comment } = req.body;

  // Check if user already reviewed
  const existingReview = await Review.findOne({
    user: req.user.id,
    reviewType,
    ...(car && { car }),
    ...(part && { part }),
    ...(dealer && { dealer }),
  });

  if (existingReview) {
    return res.status(400).json({
      success: false,
      message: 'You have already reviewed this item',
    });
  }

  const review = await Review.create({
    user: req.user.id,
    reviewType,
    car,
    part,
    dealer,
    rating,
    title,
    comment,
  });

  // Update rating
  await updateRating(reviewType, car || part || dealer);

  res.status(201).json({
    success: true,
    data: review,
  });
});

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  const { reviewType, car, part, dealer } = req.query;

  const query = { isActive: true };
  if (reviewType) query.reviewType = reviewType;
  if (car) query.car = car;
  if (part) query.part = part;
  if (dealer) query.dealer = dealer;

  const reviews = await Review.find(query)
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.json({
    success: true,
    data: reviews,
  });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Update rating
  await updateRating(review.reviewType, review.car || review.part || review.dealer);

  res.json({
    success: true,
    data: review,
  });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  const { reviewType, car, part, dealer } = review;

  await review.deleteOne();

  // Update rating
  await updateRating(reviewType, car || part || dealer);

  res.json({
    success: true,
    message: 'Review deleted successfully',
  });
});

// @desc    Mark review as helpful
// @route   PUT /api/v1/reviews/:id/helpful
// @access  Private
export const markHelpful = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return res.status(404).json({
      success: false,
      message: 'Review not found',
    });
  }

  if (review.helpfulBy.includes(req.user.id)) {
    return res.status(400).json({
      success: false,
      message: 'Already marked as helpful',
    });
  }

  review.helpful += 1;
  review.helpfulBy.push(req.user.id);
  await review.save();

  res.json({
    success: true,
    data: review,
  });
});

// Helper function to update rating
const updateRating = async (reviewType, itemId) => {
  let Model;
  if (reviewType === 'car') Model = Car;
  else if (reviewType === 'part') Model = Part;
  else if (reviewType === 'dealer') Model = Dealer;

  const reviews = await Review.find({
    reviewType,
    [reviewType]: itemId,
    isActive: true,
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  await Model.findByIdAndUpdate(itemId, {
    'rating.average': avgRating,
    'rating.count': reviews.length,
  });
};

export default {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  markHelpful,
};
