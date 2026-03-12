import express from 'express';
import {
  createBookingOrder,
  verifyBookingPayment,
  getUserBookings,
  getSellerBookings,
  getBookingById,
  updateOfflinePayment,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create booking order
router.post('/create-order', createBookingOrder);

// Verify payment
router.post('/verify-payment', verifyBookingPayment);

// Get user bookings
router.get('/user', getUserBookings);

// Get seller bookings (leads)
router.get('/seller', getSellerBookings);

// Get booking by ID
router.get('/:id', getBookingById);

// Update offline payment (seller/admin only)
router.put('/:id/offline-payment', authorize('dealer', 'admin'), updateOfflinePayment);

// Cancel booking
router.put('/:id/cancel', cancelBooking);

export default router;
