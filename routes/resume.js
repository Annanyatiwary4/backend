import express from 'express';
import multer from 'multer';
import { ParseResume } from '../controllers/resumeController.js';
import { verifyToken } from '../middleware/verifyToken.js';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for processing
router.post('/upload', verifyToken ,upload.single('file'), ParseResume); // 'resume' is the field name in the form  

 export default router;