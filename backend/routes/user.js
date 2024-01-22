import express from "express";
import { userController } from "../controllers/userController.js";
import {
  verifyToken,
  verifyTokenAndUserAuthorization,
} from "../middleware/verifyToken.js";

const router = express.Router();
//GET ALL USERS
router.get("/", verifyToken, userController.getAllUsers);

//DELETE USER
router.delete(
  "/:id",
  verifyTokenAndUserAuthorization,
  userController.deleteUser
);

export default router;
