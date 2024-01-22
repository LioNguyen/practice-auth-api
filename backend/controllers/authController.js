import bcrypt from "bcrypt";

import User from "../models/User.js";

export const authController = {
  // REGISTER
  registerUser: async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const email = req.body.email;

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      //Create new user
      const newUser = new User({
        username,
        email,
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
      const password = req.body.password;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(404).json("Incorrect username or password");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(404).json("Incorrect username or password");
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
