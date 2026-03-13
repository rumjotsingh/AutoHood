import express from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  downloadInvoice,
} from '../controllers/orderController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/', protect, authorize('admin', 'dealer'), getAllOrders);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.get('/:id/invoice', protect, downloadInvoice);
router.patch('/:id/status', protect, authorize('admin', 'dealer'), updateOrderStatus);
router.patch('/:id/cancel', protect, cancelOrder);

export default router;
