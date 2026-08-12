import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Card title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    priority: {
      type: String,
      enum: ['none', 'low', 'medium', 'high'],
      default: 'none',
    },
    deadline: {
      type: Date,
      default: null,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Column',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model('Card', cardSchema);

export default Card;
export { Card };
