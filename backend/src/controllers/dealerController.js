import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Dealer from '../models/Dealer.js';
import User from '../models/User.js';
import { getPaginationParams } from '../utils/pagination.js';

// @desc    Register as dealer
// @route   POST /api/v1/dealers/register
// @access  Private
export const registerDealer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.dealerProfile) {
    return res.status(400).json({
      success: false,
      message: 'User already has a dealer profile',
    });
  }

  const dealer = await Dealer.create({
    user: req.user.id,
    ...req.body,
  });

  user.dealerProfile = dealer._id;
  user.role = 'dealer';
  await user.save();

  res.status(201).json({
    success: true,
    data: dealer,
  });
});

// @desc    Get dealer profile
// @route   GET /api/v1/dealers/profile
// @access  Private (Dealer)
export const getDealerProfile = asyncHandler(async (req, res) => {
  const dealer = await Dealer.findOne({ user: req.user.id }).populate('user', 'name email phone');

  if (!dealer) {
    return res.status(404).json({
      success: false,
      message: 'Dealer profile not found',
    });
  }

  res.json({
    success: true,
    data: dealer,
  });
});

// @desc    Update dealer profile
// @route   PUT /api/v1/dealers/profile
// @access  Private (Dealer)
export const updateDealerProfile = asyncHandler(async (req, res) => {
  const dealer = await Dealer.findOne({ user: req.user.id });

  if (!dealer) {
    return res.status(404).json({
      success: false,
      message: 'Dealer profile not found',
    });
  }

  const updatedDealer = await Dealer.findByIdAndUpdate(dealer._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: updatedDealer,
  });
});

// @desc    Get all dealers
// @route   GET /api/v1/dealers
// @access  Public
export const getAllDealers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { verified, city, state, isFeatured } = req.query;

  const query = { isActive: true };
  if (verified !== undefined) query.verified = verified === 'true';
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (state) query['location.state'] = new RegExp(state, 'i');
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

  const dealers = await Dealer.find(query)
    .populate('user', 'name email')
    .skip(skip)
    .limit(limit)
    .sort('-rating.average');

  const total = await Dealer.countDocuments(query);

  res.json({
    success: true,
    data: dealers,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// @desc    Get dealer by ID
// @route   GET /api/v1/dealers/:id
// @access  Public
export const getDealerById = asyncHandler(async (req, res) => {
  const dealer = await Dealer.findById(req.params.id).populate('user', 'name email phone');

  if (!dealer) {
    return res.status(404).json({
      success: false,
      message: 'Dealer not found',
    });
  }

  res.json({
    success: true,
    data: dealer,
  });
});

// @desc    Verify dealer
// @route   PUT /api/v1/dealers/:id/verify
// @access  Private (Admin)
export const verifyDealer = asyncHandler(async (req, res) => {
  const dealer = await Dealer.findById(req.params.id);

  if (!dealer) {
    return res.status(404).json({
      success: false,
      message: 'Dealer not found',
    });
  }

  dealer.verified = true;
  dealer.verifiedAt = Date.now();
  dealer.verifiedBy = req.user.id;
  await dealer.save();

  res.json({
    success: true,
    data: dealer,
  });
});

// @desc    Get dealer statistics
// @route   GET /api/v1/dealers/stats
// @access  Private (Dealer)
export const getDealerStats = asyncHandler(async (req, res) => {
  const dealer = await Dealer.findOne({ user: req.user.id });

  if (!dealer) {
    return res.status(404).json({
      success: false,
      message: 'Dealer profile not found',
    });
  }

  res.json({
    success: true,
    data: dealer.stats,
  });
});

export default {
  registerDealer,
  getDealerProfile,
  updateDealerProfile,
  getAllDealers,
  getDealerById,
  verifyDealer,
  getDealerStats,
};
