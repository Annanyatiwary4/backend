import express from 'express';
import multer from 'multer';
import { ParseResume } from '../controllers/resumeController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { createProject, deleteProject, getSingleProject, getUserProjects, updateProject } from "../controllers/ProjectController.js";



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for processing

router.post("/create-project", verifyToken,createProject);
router.get("/my-project",verifyToken,getUserProjects)
router.get("/my-project/:id", verifyToken, getSingleProject);
router.delete("/my-project/:id", verifyToken, deleteProject);
router.put("/my-project/:id", verifyToken, updateProject); // Assuming update project is handled by createProject for simplicity
router.post('/upload', verifyToken ,upload.single('file'), ParseResume); // 'resume' is the field name in the form  

 export default router;