import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

let refreshTokens = [];

export const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const { password, ...userDataWithoutPassword } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      //Create new user
      const newUser = new User({
        ...userDataWithoutPassword,
        password: hashed,
      });

      //Save user to DB
      const user = await newUser.save();
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // LOGIN
  loginUser: async (req, res) => {
    try {
      const username = req.body.username;

      const user = await User.findOne({ username });
      const { password, ...userWithoutPassword } = user._doc;

      if (!user) {
        return res.status(404).json("Incorrect username or password");
      }

      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(404).json("Incorrect username or password");
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      refreshTokens.push(refreshToken);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({ ...userWithoutPassword, accessToken });
    } catch (error) {
      console.log("🚀 @log ~ loginUser: ~ error:", error);

      return res.status(500).json(error);
    }
  },

  requestRefreshToken: async (req, res) => {
    // Take refresh token from user
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json("You're not authenticated");
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Refresh token is not valid");
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Invalid refresh token");
      }

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      // Create new access token, refresh token
      const newAccessToken = generateAccessToken(user);
      const newRefreshToken = generateRefreshToken(user);

      refreshTokens.push(newRefreshToken);
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        path: "/",
        sameSite: "strict",
      });
      return res.status(200).json({ accessToken: newAccessToken });
    });
  },

  // LOGOUT
  userLogout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    return res.status(200).json("Logged out!");
  },
};
