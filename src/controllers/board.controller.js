import asyncHandler from 'express-async-handler';
import ApiError from '../helpers/ApiError.js';
import Board from '../models/board.model.js';

// Sadece izin verilen alanları günceller
const pickBoardUpdateFields = (payload = {}) => {
  const allowed = ['title', 'titleBoard', 'background', 'icon', 'filter'];
  return Object.entries(payload).reduce((acc, [key, value]) => {
    if (!allowed.includes(key) || value === undefined) return acc;

    if (key === 'titleBoard') {
      acc.title = value; // legacy uyumluluk
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};

// Board yoksa hata fırlatır
const ensureBoard = (board, message = 'Board not found') => {
  if (!board) throw new ApiError(404, message);
  return board;
};

// GET /api/boards
export const getBoards = asyncHandler(async (req, res) => {
  const boards = await Board.find({ userId: req.user._id }).sort({
    createdAt: 1,
  });
  res.json(boards);
});

// GET /api/boards/:id
export const getBoardById = asyncHandler(async (req, res) => {
  const board = await Board.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });
  ensureBoard(board);
  res.json(board);
});

// POST /api/boards
export const createBoard = asyncHandler(async (req, res) => {
  const title = req.body.title || req.body.titleBoard;
  if (!title) throw new ApiError(400, 'Board title is required');

  const board = await Board.create({
    title,
    icon: req.body.icon ?? 'default',
    background: req.body.background ?? null,
    filter: req.body.filter ?? 'default',
    columns: [],
    userId: req.user._id,
  });

  res.status(201).json(board);
});

// PUT /api/boards/:id
export const updateBoard = asyncHandler(async (req, res) => {
  const update = pickBoardUpdateFields(req.body);
  if (!Object.keys(update).length)
    throw new ApiError(400, 'No fields provided for update');

  const board = await Board.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    update,
    { new: true }
  );

  ensureBoard(board);
  res.json(board);
});

// PATCH /api/boards/:id
export const patchBoard = updateBoard;

// DELETE /api/boards/:id
export const deleteBoard = asyncHandler(async (req, res) => {
  const board = await Board.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  ensureBoard(board);
  res.json({ message: 'Board deleted', id: req.params.id });
});
