import express from "express";
import {
  advancedSearch,
  getFilterOptions,
  compareCars,
  getSimilarCars,
  getTrendingCars,
} from "../controllers/search.controllers.js";

const router = express.Router();

// All routes are public
router.get("/advanced", advancedSearch);
router.get("/filter-options", getFilterOptions);
router.get("/compare", compareCars);
router.get("/similar/:carId", getSimilarCars);
router.get("/trending", getTrendingCars);

export default router;
