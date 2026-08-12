import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET || "supersecretjwtkey";
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || "30d";

/**
 * 🔹 Access Token üretir
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: ACCESS_TOKEN_TTL });
};

/**
 * 🔹 Refresh Token üretir
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_TOKEN_TTL });
};

/**
 * 🔎 Token doğrular → hem access hem refresh token için çalışır
 */
export const verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
