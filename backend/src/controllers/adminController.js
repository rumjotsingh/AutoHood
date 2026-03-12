import { asyncHandler } from '../middlewares/errorMiddleware.js';
import User from '../models/User.js';
import Car from '../models/Car.js';
import Order from '../models/Order.js';
import Dealer from '../models/Dealer.js';
import Brand from '../models/Brand.js';
import Part from '../models/Part.js';
import { getPaginationParams } from '../utils/pagination.js';

// @desc    Get admin dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalCars,
    totalOrders,
    totalDealers,
    totalBrands,
    totalParts,
    recentOrders,
  ] = await Promise.all([
    User.countDocuments(),
    Car.countDocuments(),
    Order.countDocuments(),
    Dealer.countDocuments(),
    Brand.countDocuments(),
    Part.countDocuments(),
    Order.find().sort('-createdAt').limit(5).populate('user', 'name email'),
  ]);

  // Calculate total revenue from completed payments
  const completedOrders = await Order.find({ paymentStatus: 'completed' });
  const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0);

  // Calculate revenue from bookings
  const Booking = (await import('../models/Booking.js')).default;
  const completedBookings = await Booking.find({ paymentStatus: 'completed' });
  const bookingRevenue = completedBookings.reduce((sum, booking) => sum + (booking.bookingAmount || 0), 0);

  // Total revenue including bookings
  const combinedRevenue = totalRevenue + bookingRevenue;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalCars,
      totalOrders,
      totalDealers,
      totalBrands,
      totalParts,
      totalRevenue: combinedRevenue,
      orderRevenue: totalRevenue,
      bookingRevenue: bookingRevenue,
      recentOrders,
    },
  });
});

// @desc    Get all users with filters
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { role, search } = req.query;

  let query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

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

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});

// @desc    Get all cars for admin
// @route   GET /api/v1/admin/cars
// @access  Private/Admin
export const getAllCarsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { status, featured } = req.query;

  let query = {};
  if (status) query.status = status;
  if (featured) query.featured = featured === 'true';

  const cars = await Car.find(query)
    .populate('brand', 'name')
    .populate('owner', 'name email')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Car.countDocuments(query);

  res.json({
    success: true,
    data: cars,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// @desc    Toggle car featured status
// @route   PUT /api/v1/admin/cars/:id/featured
// @access  Private/Admin
export const toggleCarFeatured = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  car.featured = !car.featured;
  await car.save();

  res.json({
    success: true,
    data: car,
  });
});

// @desc    Get all dealers for admin
// @route   GET /api/v1/admin/dealers
// @access  Private/Admin
export const getAllDealersAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { verified } = req.query;

  let query = {};
  if (verified !== undefined) query.verified = verified === 'true';

  const dealers = await Dealer.find(query)
    .populate('owner', 'name email')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

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

// @desc    Verify dealer
// @route   PUT /api/v1/admin/dealers/:id/verify
// @access  Private/Admin
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
  await dealer.save();

  res.json({
    success: true,
    data: dealer,
  });
});

// @desc    Get all orders for admin
// @route   GET /api/v1/admin/orders
// @access  Private/Admin
export const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { orderStatus, paymentStatus } = req.query;

  let query = {};
  if (orderStatus) query.orderStatus = orderStatus;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('car', 'title price')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Order.countDocuments(query);

  res.json({
    success: true,
    data: orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

export default {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCarsAdmin,
  toggleCarFeatured,
  getAllDealersAdmin,
  verifyDealer,
  getAllOrdersAdmin,
};
