import express from "express";
import {
  recordCarView,
  getCarViewStats,
  getUserDashboard,
  getPlatformAnalytics,
  getUserActivity,
} from "../controllers/analytics.controllers.js";
import { authenticate } from "../middleware.js";

const router = express.Router();

// Public routes
router.post("/view/:carId", recordCarView);
router.get("/car/:carId/stats", getCarViewStats);

// Protected routes
router.get("/dashboard", authenticate, getUserDashboard);
router.get("/activity", authenticate, getUserActivity);
router.get("/platform", authenticate, getPlatformAnalytics); // Could add admin check

export default router;
