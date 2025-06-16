import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true, // e.g., "theme-classic", "theme-modern"
  },
  thumbnail: {
    type: String, // URL or base64 string
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Project", projectSchema);
