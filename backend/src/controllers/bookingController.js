import { asyncHandler } from '../middlewares/errorMiddleware.js';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

// Lazy initialize Razorpay
let razorpayInstance = null;

const getRazorpayInstance = () => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay credentials are missing in environment variables');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✓ Razorpay initialized successfully');
  }
  return razorpayInstance;
};

// @desc    Create Razorpay order for booking token
// @route   POST /api/v1/bookings/create-order
// @access  Private
export const createBookingOrder = asyncHandler(async (req, res) => {
  const { carId, bookingAmount, customerDetails } = req.body;

  // Get car details
  const car = await Car.findById(carId).populate('owner', 'name email');

  if (!car) {
    return res.status(404).json({
      success: false,
      message: 'Car not found',
    });
  }

  if (car.status !== 'active') {
    return res.status(400).json({
      success: false,
      message: 'Car is not available for booking',
    });
  }

  // Calculate amounts - Fixed token amount of ₹10,000
  const carPrice = car.price;
  const FIXED_TOKEN_AMOUNT = 10000; // Fixed ₹10,000 token
  const tokenAmount = bookingAmount || FIXED_TOKEN_AMOUNT;
  const remainingAmount = carPrice - tokenAmount;

  // Create Razorpay order
  const razorpay = getRazorpayInstance();
  const razorpayOrder = await razorpay.orders.create({
    amount: tokenAmount * 100, // Convert to paise
    currency: 'INR',
    receipt: `booking_${Date.now()}`,
    notes: {
      carId: car._id.toString(),
      carTitle: car.title,
      userId: req.user.id,
    },
  });

  // Create booking in database
  const booking = await Booking.create({
    user: req.user.id,
    car: carId,
    seller: car.owner._id,
    dealer: car.dealer,
    carPrice,
    bookingAmount: tokenAmount,
    remainingAmount,
    razorpayOrderId: razorpayOrder.id,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    customerDetails: {
      name: customerDetails?.name || req.user.name,
      email: customerDetails?.email || req.user.email,
      phone: customerDetails?.phone || req.user.phone,
    },
    notes: {
      customer: req.body.notes || '',
    },
  });

  res.status(201).json({
    success: true,
    data: {
      booking,
      razorpayOrder: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      carDetails: {
        title: car.title,
        price: carPrice,
        images: car.images,
      },
    },
  });
});

// @desc    Verify Razorpay payment and confirm booking
// @route   POST /api/v1/bookings/verify-payment
// @access  Private
export const verifyBookingPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  // Find booking
  const booking = await Booking.findById(bookingId).populate('car', 'title price').populate('seller', 'name email');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    booking.paymentStatus = 'failed';
    await booking.save();

    return res.status(400).json({
      success: false,
      message: 'Payment verification failed',
    });
  }

  // Update booking
  booking.razorpayPaymentId = razorpay_payment_id;
  booking.razorpaySignature = razorpay_signature;
  booking.paymentStatus = 'completed';
  booking.bookingStatus = 'confirmed';
  booking.confirmedAt = Date.now();

  await booking.save();

  // TODO: Send notification to seller
  // await sendBookingNotification(booking);

  res.json({
    success: true,
    message: 'Booking confirmed successfully',
    data: booking,
  });
});

// @desc    Get user bookings
// @route   GET /api/v1/bookings/user
// @access  Private
export const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id })
    .populate('car', 'title price images brand model year')
    .populate('seller', 'name email phone')
    .sort('-createdAt');

  res.json({
    success: true,
    data: bookings,
  });
});

// @desc    Get seller bookings (leads)
// @route   GET /api/v1/bookings/seller
// @access  Private
export const getSellerBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ seller: req.user.id })
    .populate('car', 'title price images brand model year')
    .populate('user', 'name email phone')
    .sort('-createdAt');

  res.json({
    success: true,
    data: bookings,
  });
});

// @desc    Get booking by ID
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('car', 'title price images brand model year location')
    .populate('user', 'name email phone')
    .populate('seller', 'name email phone');

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (
    booking.user.toString() !== req.user.id &&
    booking.seller.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Update offline payment status
// @route   PUT /api/v1/bookings/:id/offline-payment
// @access  Private (Seller/Admin)
export const updateOfflinePayment = asyncHandler(async (req, res) => {
  const { amountPaid, paymentMode, transactionRef } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (booking.seller.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  // Update offline payment details
  booking.offlinePaymentDetails.amountPaid += amountPaid;
  booking.offlinePaymentDetails.paymentMode = paymentMode;
  booking.offlinePaymentDetails.transactionRef = transactionRef;
  booking.offlinePaymentDetails.paidAt = Date.now();

  // Update status
  if (booking.offlinePaymentDetails.amountPaid >= booking.remainingAmount) {
    booking.offlinePaymentStatus = 'completed';
    booking.bookingStatus = 'completed';
    booking.completedAt = Date.now();
  } else if (booking.offlinePaymentDetails.amountPaid > 0) {
    booking.offlinePaymentStatus = 'partial';
  }

  await booking.save();

  res.json({
    success: true,
    data: booking,
  });
});

// @desc    Cancel booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      success: false,
      message: 'Booking not found',
    });
  }

  // Check authorization
  if (
    booking.user.toString() !== req.user.id &&
    booking.seller.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized',
    });
  }

  if (booking.bookingStatus === 'completed') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel completed booking',
    });
  }

  booking.bookingStatus = 'cancelled';
  booking.cancelledAt = Date.now();
  booking.cancellationReason = reason;

  await booking.save();

  // TODO: Process refund if payment was completed
  // if (booking.paymentStatus === 'completed') {
  //   await processRefund(booking);
  // }

  res.json({
    success: true,
    message: 'Booking cancelled successfully',
    data: booking,
  });
});

export default {
  createBookingOrder,
  verifyBookingPayment,
  getUserBookings,
  getSellerBookings,
  getBookingById,
  updateOfflinePayment,
  cancelBooking,
};
