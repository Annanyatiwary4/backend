import express from "express";
import { forgotPassword, login, logout, register, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login",login ); // Assuming login is handled by the same controller for simplicity
router.post("/verify-email", verifyEmail);
router.post("/logout",logout);
router.post("/forgot-password",forgotPassword);

export default router;
