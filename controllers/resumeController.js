import pdfParse from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
console.log("🔑 Gemini Key:", process.env.GEMINI_API);


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
   console.log("🤖 Gemini raw:", text);

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini returned invalid JSON:", text);
    return {};
  }
};

export const ParseResume = async (req, res) => {
  try {
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const resumeText = pdfData.text;

    const parsedData = await getStructuredResumeFromGemini(resumeText);
    res.json(parsedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Resume parsing failed" });
  }
};


