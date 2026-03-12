import express from 'express';
import {
  bookTestDrive,
  getTestDrives,
  getTestDriveById,
  updateTestDriveStatus,
  cancelTestDrive,
  addFeedback,
} from '../controllers/testDriveController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Protected routes
router.post('/', protect, bookTestDrive);
router.get('/', protect, getTestDrives);
router.get('/:id', protect, getTestDriveById);
router.patch('/:id/status', protect, authorize('admin', 'dealer'), updateTestDriveStatus);
router.patch('/:id/cancel', protect, cancelTestDrive);
router.put('/:id/feedback', protect, addFeedback);

export default router;
