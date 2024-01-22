import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import { connectDB } from "./utils/connectDB.js";
import authRouter from "./routes/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;
const MONGODB_URL = process.env.MONGODB_URL;

connectDB(MONGODB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
