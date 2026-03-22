import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import CrimeScene from "../models/CrimeScene.js";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeCrimeScene = async (req, res) => {
  try {
    // 🔍 Check if file exists
    if (!req.file) {
      return res.status(400).json({
        error: "No file uploaded. Use form field name 'image'."
      });
    }

    const file = req.file;

    const savedPath =
      file.path || path.join(__dirname, "..", "uploads", file.filename);

    console.log("[analyzeCrimeScene] File received:", {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      savedPath,
    });

    // 🚀 CALL PYTHON AI SERVICE
    const formData = new FormData();
    formData.append("file", fs.createReadStream(savedPath));

    const response = await axios.post(
      "https://crimesolver-ai.onrender.com/analyze",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const analysis = response.data;

    // 🔍 Validate response
    if (!analysis || typeof analysis !== "object") {
      return res.status(500).json({
        error: "Invalid analysis result from AI",
      });
    }

    // 💾 Save to MongoDB
    const sceneDoc = new CrimeScene({
      caseId: req.body.caseId || null,
      title: req.body.title || "",
      images: [{ filename: file.filename, path: savedPath }],
      analysisResult: analysis,
      meta: {
        uploadedAt: new Date(),
        uploader: req.body.uploader || null,
      },
    });

    try {
      await sceneDoc.save();
    } catch (saveErr) {
      console.error("[DB ERROR]:", saveErr);

      return res.status(200).json({
        warning: "Analysis worked, but DB save failed",
        analysis,
        dbError: saveErr.message,
      });
    }

    // ✅ SUCCESS RESPONSE
    return res.status(200).json({
      message: "Analysis complete",
      analysis,
      id: sceneDoc._id,
      image: file.filename,
    });

  } catch (err) {
    console.error("[SERVER ERROR]:", err.response?.data || err.message);

    return res.status(500).json({
      error: "Server error",
      detail: err.message,
    });
  }
};