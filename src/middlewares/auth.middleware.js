import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import ApiError from '../helpers/ApiError.js';

import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new ApiError(401, 'Authorization header missing');
    }

    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new ApiError(401, 'Invalid authorization format');
    }

    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    console.log(`🔐 Authenticated user: ${user.email}`);

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Access token expired'));
    } else if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else {
      next(new ApiError(401, error.message));
    }
  }
};

export { authenticate as protect };
