import express from "express";
import {
  createCarListing,
  GetAllCarsController,
  getSingleCarController,
  deleteCarController,
  EditCarController,
  CarSearchController,
} from "../controllers/carListing.controllers.js";
import { authenticate } from "../middleware.js";

import { upload } from "../cloudinary.js";
const router = express.Router();
router.get("/all-cars", GetAllCarsController);
router.get("/all-cars/:id", getSingleCarController);
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
router.get("/search", CarSearchController);
export default router;
