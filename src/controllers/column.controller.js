import asyncHandler from "express-async-handler";
import ApiError from "../helpers/ApiError.js";
import Board from "../models/board.model.js";

const findBoardByColumn = async (columnId, userId) => {
  const board = await Board.findOne({
    userId,
    "columns._id": columnId,
  });
  if (!board) {
    throw new ApiError(404, "Column not found");
  }
  const column = board.columns.id(columnId);
  if (!column) {
    throw new ApiError(404, "Column not found");
  }
  return { board, column };
};

// POST /api/columns
export const createColumn = asyncHandler(async (req, res) => {
  const { boardId } = req.body;
  const title = req.body.title || req.body.titleColumn;
  if (!boardId || !title) {
    throw new ApiError(400, "Board ID and column title are required");
  }

  const board = await Board.findOne({
    _id: boardId,
    userId: req.user._id,
  });

  if (!board) {
    throw new ApiError(404, "Board not found");
  }

  board.columns.push({ title, cards: [] });
  await board.save();

  res.status(201).json(board.columns[board.columns.length - 1]);
});

// PATCH /api/columns/:id
export const updateColumn = asyncHandler(async (req, res) => {
  const { columnId } = req.params;
  const title = req.body.title || req.body.titleColumn;

  if (!title) {
    throw new ApiError(400, "Column title is required");
  }

  const { board, column } = await findBoardByColumn(columnId, req.user._id);
  column.title = title;
  await board.save();

  res.json(column);
});

// DELETE /api/columns/:id
export const deleteColumn = asyncHandler(async (req, res) => {
  const { columnId } = req.params;

  const { board } = await findBoardByColumn(columnId, req.user._id);
  board.columns.pull({ _id: columnId });
  await board.save();

  res.json({ message: "Column deleted", id: columnId });
});
