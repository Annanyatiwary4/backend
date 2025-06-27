import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Project from "../models/Projects.js";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const cleanJSON = (text) => {
  const trimmed = text.trim();

  // Remove triple backticks and optional json
  if (trimmed.startsWith("```")) {
    return trimmed.replace(/^```(?:json)?\n/, "").replace(/\n```$/, "").trim();
  }
  return trimmed;
};

const getStructuredResumeFromGemini = async (resumeText) => {
const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });

 // using updated version

  const prompt = `
You're a resume parser. Given the raw text of a resume, extract the following fields and return them in clean JSON format:

{
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  linkedin: "",
  github: "",
  skills: [],
  education: [
    {
      degree: "",
      institution: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  ],
  experience: [
    {
      role: "",
      company: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  ],
  projects: [
    {
      name: "",
      description: "",
      techStack: [],
      github: "",
      liveDemo: ""
    }
  ],
  achievements: [],
  certifications: [],
  languages: [],
  hobbies: []
}

Resume text:
"""
${resumeText}
"""
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  

   try {
    const cleaned = cleanJSON(text);
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (error) {
    console.error("❌ Gemini returned invalid JSON after cleanup:", error.message);
    return {};
  }
};

export const ParseResume = async (req, res) => {
  try {
    const { projectId } = req.body; // send this from frontend!
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const parsedData = await getStructuredResumeFromGemini(resumeText);
    
     // 🔐 You should already have req.user injected via auth middleware
      const userId = req.userId;
     const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId },
      { $set: { resumeData: parsedData } },
      { new: true }
    );

    console.log("🔍 Updated Project:", updatedProject);

    if (!updatedProject) {
      console.log("❌ Not found project for ID:", projectId, "and user:", userId);
      return res.status(404).json({ error: "Project not found or not yours" });
    }

    res.json(updatedProject.resumeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume parsing failed" });
  }
};


