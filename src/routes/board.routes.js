// backend/src/routes/board.routes.js

import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createBoard,
  deleteBoard,
  getBoardById,
  getBoards,
  patchBoard,
  updateBoard,
} from "../controllers/board.controller.js";

const router = express.Router();


router.use(authenticate);  // Tüm işlem için kimlik doğrulama gereksin

router.route("/").get(getBoards).post(createBoard);
router
  .route("/:id")
  .get(getBoardById)
  .put(updateBoard)
  .patch(patchBoard)
  .delete(deleteBoard);

export default router;




