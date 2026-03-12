import express from 'express';
import {
  getAllParts,
  getPartById,
  createPart,
  updatePart,
  deletePart,
  searchParts,
} from '../controllers/partController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllParts);
router.get('/search', searchParts);
router.get('/:id', getPartById);

// Protected routes
router.post('/', protect, authorize('dealer', 'admin'), createPart);
router.put('/:id', protect, updatePart);
router.delete('/:id', protect, deletePart);

export default router;
