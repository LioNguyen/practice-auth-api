import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connect to DB");
  } catch (error) {
    console.log("🚀 @log ~ connectDB ~ error:", error);
  }
};
