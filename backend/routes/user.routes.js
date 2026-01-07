import express from "express";
import {
  registerController,
  loginController,
  googleLoginController,
} from "../controllers/user.controller.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google-login", googleLoginController);
export default router;
