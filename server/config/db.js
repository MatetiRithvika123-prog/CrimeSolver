import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crimesolver");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Failed", err);
    process.exit(1);
  }
};

export default connectDB;
