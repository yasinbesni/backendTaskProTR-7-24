import ApiError from "../helpers/ApiError.js";
import Board from "../models/board.model.js";

export const authorizeOwner = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const boardId = req.params.boardId || req.params.id; // nested endpoint destekler

    if (!boardId) {
      throw new ApiError(400, "Board ID is required");
    }

    const board = await Board.findById(boardId);

    if (!board) {
      throw new ApiError(404, "Board not found");
    }

    if (board.userId.toString() !== userId.toString()) {
      console.log(`🚫 Unauthorized access by user ${userId} on board ${boardId}`);
      throw new ApiError(403, "You are not authorized to access this resource");
    }

    next();
  } catch (error) {
    next(error);
  }
};
