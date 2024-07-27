import express from "express";
import { createUser, loginUser, logoutUser } from "./userController";
import authenticate from "../middlewares/authenticate";

const userRouter = express.Router();

// routes
userRouter.post("/register", createUser);
userRouter.post("/login", authenticate, loginUser);
userRouter.get("/logout", authenticate, logoutUser);

export default userRouter;
