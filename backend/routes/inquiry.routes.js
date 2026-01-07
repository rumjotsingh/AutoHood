import express from "express";
import {
  sendInquiry,
  getSentInquiries,
  getReceivedInquiries,
  replyToInquiry,
  markAsRead,
  getUnreadCount,
} from "../controllers/inquiry.controllers.js";
import { authenticate } from "../middleware.js";

const router = express.Router();

// All routes require authentication
router.post("/car/:carId", authenticate, sendInquiry);
router.get("/sent", authenticate, getSentInquiries);
router.get("/received", authenticate, getReceivedInquiries);
router.post("/reply/:inquiryId", authenticate, replyToInquiry);
router.patch("/read/:inquiryId", authenticate, markAsRead);
router.get("/unread-count", authenticate, getUnreadCount);

export default router;
