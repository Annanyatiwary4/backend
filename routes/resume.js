import express from 'express';
import multer from 'multer';
import { ParseResume } from '../controllers/resumeController.js';


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for processing
router.post('/upload', upload.single('file'), ParseResume); // 'resume' is the field name in the form  

 export default router;