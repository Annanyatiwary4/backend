import express from "express";
import { checkAuth, forgotPassword, login, logout, register, ResetPassword, verifyEmail } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { createProject, deleteProject, getSingleProject, getUserProjects, updateProject } from "../controllers/ProjectController.js";


const router = express.Router();


router.get("/check-auth", verifyToken, checkAuth); // Middleware to verify token before accessing this route
router.post("/register", register);
router.post("/login",login ); // Assuming login is handled by the same controller for simplicity
router.post("/verify-email", verifyEmail);
router.post("/logout",logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",ResetPassword);
router.post("/create-project", verifyToken,createProject);
router.get("/my-project",verifyToken,getUserProjects)
router.get("/my-project/:id", verifyToken, getSingleProject);
router.delete("/my-project/:id", verifyToken, deleteProject);
router.put("/my-project/:id", verifyToken, updateProject); // Assuming update project is handled by createProject for simplicity

export default router;
