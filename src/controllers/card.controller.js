import asyncHandler from 'express-async-handler';
import ApiError from '../helpers/ApiError.js';
import Board from '../models/board.model.js';

const allowedPriorities = ['without', 'low', 'medium', 'high'];

const findBoardByCardId = async (cardId, userId) => {
  const board = await Board.findOne({
    userId,
    'columns.cards._id': cardId,
  });

  if (!board) {
    throw new ApiError(404, 'Card not found');
  }

  let ownerColumn = null;
  let cardDoc = null;

  board.columns.forEach((column) => {
    if (!ownerColumn) {
      const card = column.cards.id(cardId);
      if (card) {
        ownerColumn = column;
        cardDoc = card;
      }
    }
  });

  if (!ownerColumn || !cardDoc) {
    throw new ApiError(404, 'Card not found');
  }

  return { board, column: ownerColumn, card: cardDoc };
};

// POST /api/cards
export const createCard = asyncHandler(async (req, res) => {
  const { columnId, description, priority, deadline } = req.body;
  const title = req.body.title || req.body.titleCard;

  if (!columnId || !title) {
    throw new ApiError(400, 'Column ID and card title are required');
  }

  const board = await Board.findOne({
    userId: req.user._id,
    'columns._id': columnId,
  });

  if (!board) {
    throw new ApiError(404, 'Column not found');
  }

  const column = board.columns.id(columnId);

  // Priority kontrolü
  const cardPriority = allowedPriorities.includes(priority)
    ? priority
    : 'without';

  // Deadline kontrolü
  let cardDeadline = null;
  if (deadline) {
    const parsedDate = new Date(deadline);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, 'Invalid deadline date');
    }
    cardDeadline = parsedDate;
  }

  const newCard = {
    title,
    description: description || '',
    priority: cardPriority,
    deadline: cardDeadline,
  };

  column.cards.push(newCard);
  await board.save();

  res.status(201).json(column.cards[column.cards.length - 1]);
});

// PUT /api/cards/:cardId
export const updateCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { description, priority, deadline } = req.body;
  const title = req.body.title || req.body.titleCard;

  const { board, card } = await findBoardByCardId(cardId, req.user._id);

  if (title !== undefined) card.title = title;
  if (description !== undefined) card.description = description;

  if (priority !== undefined) {
    card.priority = allowedPriorities.includes(priority) ? priority : 'without';
  }

  if (deadline !== undefined) {
    if (deadline) {
      const parsedDate = new Date(deadline);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(400, 'Invalid deadline date');
      }
      card.deadline = parsedDate;
    } else {
      card.deadline = null;
    }
  }

  await board.save();
  res.json(card);
});

// PATCH /api/cards/:cardId
export const moveCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { columnId } = req.body;

  if (!columnId) {
    throw new ApiError(400, 'Target column is required');
  }

  const { board, column, card } = await findBoardByCardId(cardId, req.user._id);

  if (column._id.toString() === columnId.toString()) {
    return res.json(card);
  }

  const cardData = card.toObject();
  column.cards.pull(cardId);

  const targetColumn = board.columns.id(columnId);
  if (!targetColumn) {
    throw new ApiError(404, 'Target column not found');
  }

  targetColumn.cards.push(cardData);
  await board.save();

  res.json(targetColumn.cards[targetColumn.cards.length - 1]);
});

// DELETE /api/cards/:cardId
export const deleteCard = asyncHandler(async (req, res) => {
  const { cardId } = req.params;
  const { board, column } = await findBoardByCardId(cardId, req.user._id);

  column.cards.pull(cardId);
  await board.save();

  res.json({ message: 'Card deleted', id: cardId });
});
