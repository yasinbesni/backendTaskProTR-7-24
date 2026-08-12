import express from 'express';
import { setTheme } from '../controllers/user.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.put('/theme', auth, setTheme);

export default router;
