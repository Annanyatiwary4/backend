import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';  // Corrected import
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();  // Use the named function

app.use(express.json());
app.use(cors());
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
