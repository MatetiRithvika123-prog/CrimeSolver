// server/controllers/analysisController.js
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import CrimeScene from "../models/CrimeScene.js";           // make sure this path & filename are correct
import { analyzeImage } from "../ai/pyRunner.js";         // replace with your real analyzer
// fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeCrimeScene = async (req, res) => {
  try {
    // sanity checks
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use form field name 'image'." });
    }

    // multer provides file.path (full path on disk) and file.filename
    const file = req.file;
    const savedPath = file.path || path.join(__dirname, "..", "uploads", file.filename);

    console.log("[analyzeCrimeScene] Received file:", {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
      savedPath,
    });

    // Call your analyzer (must return JS object)
    // analyzeImage should be async and accept the file path
    const analysis = await analyzeImage(savedPath);

    // Validate analysis
    if (!analysis || typeof analysis !== "object") {
      console.error("[analyzeCrimeScene] Invalid analysis result:", analysis);
      return res.status(500).json({ error: "Invalid analysis result from AI" });
    }

    // Build DB doc (optional: only if you want to persist)
    // keep both filename and path so frontend can request /uploads/<filename>
    const sceneDoc = new CrimeScene({
      caseId: req.body.caseId || null,
      title: req.body.title || "",
      images: [{ filename: file.filename, path: savedPath }],
      analysisResult: analysis,
      meta: {
        uploadedAt: new Date(),
        uploader: req.body.uploader || null
      }
    });

    // Save doc (if you use Mongo)
    try {
      await sceneDoc.save();
    } catch (saveErr) {
      console.error("[analyzeCrimeScene] Failed to save CrimeScene:", saveErr);
      // still return analysis result to client even if DB save fails
      return res.status(200).json({
        warning: "analysis returned but saving to DB failed",
        analysis,
        dbError: saveErr.message
      });
    }

    // Return success + analysis + DB id
    return res.status(200).json({
      message: "Analysis complete",
      analysis,
      id: sceneDoc._id,
      image: file.filename,
    });
  } catch (err) {
    console.error("[analyzeCrimeScene] Unexpected error:", err);
    return res.status(500).json({ error: "Server error", detail: err.message });
  }
};
