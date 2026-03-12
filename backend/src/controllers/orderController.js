import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Order from '../models/Order.js';
import { getPaginationParams } from '../utils/pagination.js';

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { orderType, car, items, pricing, shippingAddress, billingAddress } = req.body;

  const order = await Order.create({
    user: req.user.id,
    orderType,
    car,
    items,
    pricing,
    shippingAddress,
    billingAddress,
    statusHistory: [{
      status: 'pending',
      note: 'Order created',
      timestamp: Date.now(),
    }],
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private (Admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { orderStatus, paymentStatus } = req.query;

  const query = {};
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

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('car', 'title brand model price')
    .populate('items.part', 'name price')
    .populate('payment')
    .populate('invoice');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Get my orders
// @route   GET /api/v1/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);

  const orders = await Order.find({ user: req.user.id })
    .populate('car', 'title price images')
    .populate('items.part', 'name price')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await Order.countDocuments({ user: req.user.id });

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

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private (Admin/Seller)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  order.orderStatus = status;
  order.statusHistory.push({
    status,
    note,
    updatedBy: req.user.id,
    timestamp: Date.now(),
  });

  if (status === 'delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save();

  res.json({
    success: true,
    data: order,
  });
});

// @desc    Cancel order
// @route   PUT /api/v1/orders/:id/cancel
// @access  Private
export const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  }

  if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  if (order.orderStatus === 'delivered') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel delivered order',
    });
  }

  order.orderStatus = 'cancelled';
  order.cancelledAt = Date.now();
  order.cancellationReason = reason;
  order.statusHistory.push({
    status: 'cancelled',
    note: reason,
    updatedBy: req.user.id,
    timestamp: Date.now(),
  });

  await order.save();

  res.json({
    success: true,
    data: order,
  });
});

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
};
