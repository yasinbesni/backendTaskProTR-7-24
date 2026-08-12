import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createColumn,
  deleteColumn,
  updateColumn,
} from "../controllers/column.controller.js";

const router = express.Router();

// Tüm işlemler için kullanıcı girişi gerekli
router.use(authenticate);

router.post("/", createColumn);
router.patch("/:columnId", updateColumn);
router.delete("/:columnId", deleteColumn);

export default router;
