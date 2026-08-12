import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createCard,
  deleteCard,
  moveCard,
  updateCard,
} from '../controllers/card.controller.js';

const router = express.Router();

// Token kontrolü – tüm işlemler giriş gerektirir
router.use(authenticate);

router.post('/', createCard);
router.put('/:cardId', updateCard);
router.patch('/:cardId', moveCard);
router.delete('/:cardId', deleteCard);

export default router;
