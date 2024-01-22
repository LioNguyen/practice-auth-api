import User from "../models/User.js";

export const userController = {
  //GET ALL USER
  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //DELETE A USER
  deleteUser: async (req, res) => {
    try {
      // await User.findByIdAndDelete(req.params.id);
      const user = await User.findById(req.params.id);
      return res.status(200).json("Delete successfully");
      res.status(200).json("User deleted");
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
