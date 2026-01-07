import express from "express";
import { getPayment } from "../controllers/Payment.controllers.js";
import { authenticate } from "../middleware.js";

const router = express.Router();
router.post("/payment", authenticate, getPayment);
export default router;
