import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import analysisRoutes from "./routes/analysisRoutes.js";

dotenv.config();

const app = express();

// 🔧 Middleware
app.use(cors());
app.use(express.json());

// ✅ Basic route (for testing deployment)
app.get("/", (req, res) => {
  res.send("CrimeSolver API is running 🚀");
});

// 🔥 Routes
app.use("/api/crime", analysisRoutes);

// 🔧 Database connection with error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

// 🚀 Start server only after DB connects
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
});