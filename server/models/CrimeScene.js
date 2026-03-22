import mongoose from "mongoose";

const CrimeSceneSchema = new mongoose.Schema({
  caseId: String,
  title: String,
  description: String,
  // Changed to an array of Objects to match your Controller logic
  images: [{
    filename: String,
    path: String
  }],
  analysisResult: Object,
  // Added meta field because your controller tries to save to it
  meta: {
    uploadedAt: { type: Date, default: Date.now },
    uploader: String
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("CrimeScene", CrimeSceneSchema);