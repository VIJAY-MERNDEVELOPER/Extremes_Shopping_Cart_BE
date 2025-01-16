import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  level: {
    type: String,
    default: 1,
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
    default: null,
  },
});

export const Category = mongoose.model("Category", categorySchema);
