import express from 'express';
import {
  contactDealer,
  getDealerInquiries,
  getMyInquiries,
  updateInquiryStatus,
} from '../controllers/contactController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Contact dealer
router.post('/dealer', contactDealer);

// Get my inquiries
router.get('/my-inquiries', getMyInquiries);

// Get dealer inquiries
router.get('/dealer/inquiries', authorize('dealer', 'admin'), getDealerInquiries);

// Update inquiry status
router.patch('/:id/status', authorize('dealer', 'admin'), updateInquiryStatus);

export default router;
