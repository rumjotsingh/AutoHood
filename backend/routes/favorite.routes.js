import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavorite,
  getFavoriteCount,
} from "../controllers/favorite.controllers.js";
import { authenticate } from "../middleware.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/:carId", authenticate, addToFavorites);
router.delete("/:carId", authenticate, removeFromFavorites);
router.get("/my-favorites", authenticate, getUserFavorites);
router.get("/check/:carId", authenticate, checkFavorite);

// Public route
router.get("/count/:carId", getFavoriteCount);

export default router;
