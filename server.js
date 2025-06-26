import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import resumeRoutes from "./routes/resume.js"; // Importing resume routes

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173",  // your frontend URL
  credentials: true                // allow cookies/headers to be sent
}));
app.use(express.json()); //allows us to parse incoming requests : req.body

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB connection error:", err));
  
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes); // Importing resume routes
 //  Middleware to parse cookies

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
