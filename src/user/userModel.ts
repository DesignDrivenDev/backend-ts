import mongoose from "mongoose";
import { User } from "./userTypes";

const userSchema = new mongoose.Schema<User>(
  {
    name: { type: String, required: [true, "Please provide name"] },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
    },
    password: { type: String, required: [true, "Please provide password"] },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model<User>("User", userSchema);

export default userModel;
