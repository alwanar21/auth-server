import { prismaClient } from "../app/database.js";
import dotenv from "dotenv";
import { verifyToken } from "../utils/token.js";
dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  }

  try {
    const decoded = verifyToken(token, "token");

    const userProfile = await prismaClient.profile.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!userProfile) {
      return res
        .status(401)
        .json({
          errors: "Unauthorized",
        })
        .end();
    }

    req.user = userProfile;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        errors: "Invalid token",
      })
      .end();
  }
};
