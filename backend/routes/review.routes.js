import express from "express";
import {
  AddReviewsController,
  deleteReview,
  getCarDetails,
} from "../controllers/Review.controllers.js";
import { authenticate } from "../middleware.js";
const router = express.Router();
router.post("/cars/:id/reviews", authenticate, AddReviewsController);
router.get("/cars/:id", getCarDetails);
router.delete("/:reviewId", authenticate, deleteReview);
export default router;
