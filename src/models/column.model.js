import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Column title is required'],
      trim: true,
    },
    boardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    userId: {
      // kolonun sahibi (board owner ile aynı)
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Column = mongoose.model('Column', columnSchema);

export default Column;
export { Column };
