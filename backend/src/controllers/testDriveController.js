import { asyncHandler } from '../middlewares/errorMiddleware.js';
import TestDrive from '../models/TestDrive.js';
import { getPaginationParams } from '../utils/pagination.js';

// @desc    Book test drive
// @route   POST /api/v1/test-drives
// @access  Private
export const bookTestDrive = asyncHandler(async (req, res) => {
  const testDrive = await TestDrive.create({
    user: req.user.id,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    data: testDrive,
  });
});

// @desc    Get test drives
// @route   GET /api/v1/test-drives
// @access  Private
export const getTestDrives = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req);
  const { status } = req.query;

  let query = {};

  if (req.user.role === 'buyer') {
    query.user = req.user.id;
  } else if (req.user.role === 'dealer') {
    query.dealer = req.user.dealerProfile;
  }

  if (status) query.status = status;

  const testDrives = await TestDrive.find(query)
    .populate('user', 'name email phone')
    .populate('car', 'title brand model price images')
    .populate('dealer', 'companyName location')
    .skip(skip)
    .limit(limit)
    .sort('-createdAt');

  const total = await TestDrive.countDocuments(query);

  res.json({
    success: true,
    data: testDrives,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
});

// @desc    Get test drive by ID
// @route   GET /api/v1/test-drives/:id
// @access  Private
export const getTestDriveById = asyncHandler(async (req, res) => {
  const testDrive = await TestDrive.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('car', 'title brand model price images')
    .populate('dealer', 'companyName location contactPhone');

  if (!testDrive) {
    return res.status(404).json({
      success: false,
      message: 'Test drive not found',
    });
  }

  if (
    testDrive.user.toString() !== req.user.id &&
    testDrive.dealer?.toString() !== req.user.dealerProfile?.toString() &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  res.json({
    success: true,
    data: testDrive,
  });
});

// @desc    Update test drive status
// @route   PUT /api/v1/test-drives/:id/status
// @access  Private (Dealer/Admin)
export const updateTestDriveStatus = asyncHandler(async (req, res) => {
  const { status, confirmedDate, confirmedTime, notes } = req.body;

  const testDrive = await TestDrive.findById(req.params.id);

  if (!testDrive) {
    return res.status(404).json({
      success: false,
      message: 'Test drive not found',
    });
  }

  testDrive.status = status;
  if (confirmedDate) testDrive.confirmedDate = confirmedDate;
  if (confirmedTime) testDrive.confirmedTime = confirmedTime;
  if (notes) testDrive.notes.dealer = notes;

  if (status === 'completed') {
    testDrive.completedAt = Date.now();
  } else if (status === 'cancelled') {
    testDrive.cancelledAt = Date.now();
  }

  await testDrive.save();

  res.json({
    success: true,
    data: testDrive,
  });
});

// @desc    Cancel test drive
// @route   PUT /api/v1/test-drives/:id/cancel
// @access  Private
export const cancelTestDrive = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const testDrive = await TestDrive.findById(req.params.id);

  if (!testDrive) {
    return res.status(404).json({
      success: false,
      message: 'Test drive not found',
    });
  }

  if (testDrive.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  testDrive.status = 'cancelled';
  testDrive.cancelledAt = Date.now();
  testDrive.cancellationReason = reason;
  await testDrive.save();

  res.json({
    success: true,
    data: testDrive,
  });
});

// @desc    Add feedback
// @route   PUT /api/v1/test-drives/:id/feedback
// @access  Private
export const addFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const testDrive = await TestDrive.findById(req.params.id);

  if (!testDrive) {
    return res.status(404).json({
      success: false,
      message: 'Test drive not found',
    });
  }

  if (testDrive.user.toString() !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  if (testDrive.status !== 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Can only add feedback for completed test drives',
    });
  }

  testDrive.feedback = {
    rating,
    comment,
    submittedAt: Date.now(),
  };
  await testDrive.save();

  res.json({
    success: true,
    data: testDrive,
  });
});

export default {
  bookTestDrive,
  getTestDrives,
  getTestDriveById,
  updateTestDriveStatus,
  cancelTestDrive,
  addFeedback,
};
