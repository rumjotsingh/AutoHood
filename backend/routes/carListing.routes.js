import express from "express";
import {
  createCarListing,
  GetAllCarsController,
  getSingleCarController,
  deleteCarController,
  EditCarController,
  CarSearchController,
  getMyListings,
} from "../controllers/carListing.controllers.js";
import { authenticate } from "../middleware.js";

import { upload } from "../cloudinary.js";
const router = express.Router();

// Public routes
router.get("/all-cars", GetAllCarsController);
router.get("/all-cars/:id", getSingleCarController);
router.get("/search", CarSearchController);

// Protected routes
router.get("/my-listings", authenticate, getMyListings);
router.post(
  "/new-car",
  upload.single("carListing"),
  authenticate,
  createCarListing
);
router.delete("/car-listing/:id", authenticate, deleteCarController);
router.put(
  "/car-listing/edit/:id",
  upload.single("carListing"),
  authenticate,
  EditCarController
);
export default router;
