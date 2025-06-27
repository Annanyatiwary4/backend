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
 
  config: {
    type: Object, // Store layout, selected components, colors, etc.
    default: {},
  },
   // Automatically add createdAt and updatedAt fields
  resumeData: {
    type: Object,     // 👈 parsed JSON from Gemini goes here
    default: {},
  },

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
