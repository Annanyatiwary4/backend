import express from "express";
import { checkAuth, forgotPassword, login, logout, register, ResetPassword, verifyEmail } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();


router.get("/check-auth", verifyToken, checkAuth); // Middleware to verify token before accessing this route
router.post("/register", register);
router.post("/login",login ); // Assuming login is handled by the same controller for simplicity
router.post("/verify-email", verifyEmail);
router.post("/logout",logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",ResetPassword);

export default router;
