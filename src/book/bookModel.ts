import mongoose from "mongoose";
import { Book } from "./bookTypes";

const bookSchema = new mongoose.Schema<Book>(
  {
    title: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: { type: String, required: true },
    coverImage: { type: String, required: true },
    file: { type: String, required: true },
    // publicationYear: { type: Number, required: true },
    // copies: { type: Number, required: true },
    // createdAt: { type: Date, default: Date.now },
    // updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const bookModel = mongoose.model<Book>("Book", bookSchema);

export default bookModel;