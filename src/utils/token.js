import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ResponseError } from "../error/response-error.js";
dotenv.config();

function generateToken(payload, type = "token") {
  const secretKey =
    type == "token" ? process.env.PRIVATE_TOKEN_KEY : process.env.PRIVATE_REFRESH_TOKEN_KEY;

  const options = {
    expiresIn: type == "token" ? "1h" : "1d",
  };
  let token = jwt.sign(payload, secretKey, options);
  return token;
}

function verifyToken(token, type = "token") {
  try {
    const secretKey =
      type == "token" ? process.env.PRIVATE_TOKEN_KEY : process.env.PRIVATE_REFRESH_TOKEN_KEY;

    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw new ResponseError(401, "Invalid token");
  }
}

export { generateToken, verifyToken };
