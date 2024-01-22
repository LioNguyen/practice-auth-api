import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      admin: user.isAdmin,
    },
    process.env.JWT_ACCESS_KEY,
    {
      expiresIn: "30s",
    }
  );
};
