import express from "express";
import { authController } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/refresh", authController.requestRefreshToken);
router.post("/logout", verifyToken, authController.userLogout);

export default router;
