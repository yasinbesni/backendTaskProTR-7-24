import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const ACCESS_EXPIRES_IN = '1h';
const REFRESH_EXPIRES_IN = '30d';

const signToken = (payload, expiresIn) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn });

export const generateTokens = (user) => {
  const payload = { id: user._id };

  const accessToken = signToken(payload, ACCESS_EXPIRES_IN);
  const refreshToken = signToken(payload, REFRESH_EXPIRES_IN);

  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  const tokens = generateTokens(user);

  return { user, ...tokens };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  user.password = undefined;

  const tokens = generateTokens(user);
  return { user, ...tokens };
};

export default {
  generateTokens,
  registerUser,
  loginUser,
};
