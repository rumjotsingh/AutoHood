import express from "express";
const router = express.Router();
import { sendFeedback } from "../controllers/feedback.controllers.js";

router.post("/create-feedback", sendFeedback);

export default router;
