import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    priority: {
      type: String,
      enum: ["none", "low", "medium", "high"],
      default: "none",
    },
    deadline: { type: Date, default: null },
    columnId: { type: mongoose.Schema.Types.ObjectId, ref: "Column" },
  },
  { timestamps: true }
);

const columnSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cards: [cardSchema],
  },
  { timestamps: true }
);

const boardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, default: "default" },
    filter: { type: String, default: "default" },
    background: { type: String, default: null },
    columns: [columnSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Board", boardSchema);
