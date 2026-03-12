import { asyncHandler } from '../middlewares/errorMiddleware.js';
import User from '../models/User.js';
import Dealer from '../models/Dealer.js';
import Car from '../models/Car.js';
import Order from '../models/Order.js';
import Brand from '../models/Brand.js';
import { getPaginationParams } from '../utils/pagination.js';

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate('dealerProfile')
    .populate('wishlist');

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;

  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Delete user account
// @route   DELETE /api/v1/users/account
// @access  Private
export const deleteUserAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'Account deactivated successfully',
  });
});

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private (Admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { role, isActive } = req.query;

  const query = {};
  if (role) query.role = role;
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const users = await User.find(query)
    .select('-password')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// @desc    Get admin dashboard stats
// @route   GET /api/v1/users/admin/stats
// @access  Private (Admin)
export const getAdminStats = asyncHandler(async (_req, res) => {
  const [
    totalUsers,
    activeUsers,
    totalDealers,
    verifiedDealers,
    totalCars,
    pendingCars,
    featuredCars,
    totalOrders,
    pendingOrders,
    totalBrands,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Dealer.countDocuments(),
    Dealer.countDocuments({ verified: true }),
    Car.countDocuments(),
    Car.countDocuments({ status: 'pending' }),
    Car.countDocuments({ featured: true }),
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Brand.countDocuments(),
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      dealers: {
        total: totalDealers,
        verified: verifiedDealers,
      },
      cars: {
        total: totalCars,
        pending: pendingCars,
        featured: featuredCars,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
      },
      brands: {
        total: totalBrands,
      },
    },
  });
});

// @desc    Update user role
// @route   PUT /api/v1/users/:id/role
// @access  Private (Admin)
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user active status
// @route   PATCH /api/v1/users/:id/status
// @access  Private (Admin)
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'isActive must be a boolean value',
    });
  }

  user.isActive = isActive;
  await user.save();

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Add to wishlist
// @route   POST /api/v1/users/wishlist/:carId
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { carId } = req.params;

  if (!user.wishlist.includes(carId)) {
    user.wishlist.push(carId);
    await user.save();
  }

  res.json({
    success: true,
    data: user.wishlist,
  });
});

// @desc    Remove from wishlist
// @route   DELETE /api/v1/users/wishlist/:carId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { carId } = req.params;

  user.wishlist = user.wishlist.filter(id => id.toString() !== carId);
  await user.save();

  res.json({
    success: true,
    data: user.wishlist,
  });
});

// @desc    Get wishlist
// @route   GET /api/v1/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'wishlist',
    populate: { path: 'brand', select: 'name logo' },
  });

  res.json({
    success: true,
    data: user.wishlist,
  });
});

export default {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  getAdminStats,
  updateUserRole,
  updateUserStatus,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
