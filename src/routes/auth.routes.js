import express from 'express';
import {
  register,
  login,
  getCurrentUser,
  updateProfile,
  updateTheme,
  logout,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateProfileSchema, registerSchema } from '../schemas/auth.schema.js';

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', login);

// Protected routes
router.get('/current', protect, getCurrentUser);
router.put('/profile', protect, validate(updateProfileSchema), updateProfile);
router.put('/theme', protect, updateTheme);
router.post('/logout', protect, logout);

export default router;
