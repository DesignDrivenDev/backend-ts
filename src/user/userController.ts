import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return next(createHttpError(400, "All fields are required"));
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken: token });
  } catch (error) {
    console.error("Error:", error);
    return next(createHttpError(500, "Error while creating user"));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return next(createHttpError(400, "Email and password are required"));
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(401, "Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createHttpError(401, "Invalid credentials"));
    }

    const token = sign({ sub: user._id }, config.jwtSecret as string, {
      expiresIn: "7d",
      algorithm: "HS256",
    });

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken: token });
  } catch (error) {
    console.error("Error:", error);
    return next(createHttpError(500, "Error while logging in"));
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error("Error:", error);
    return next(createHttpError(500, "Error while logging out"));
  }
};

// import { NextFunction, Request, Response } from "express";
// import createHttpError from "http-errors";
// import userModel from "./userModel";
// import bcrypt from "bcrypt";
// import { sign } from "jsonwebtoken";
// import { config } from "../config/config";
// import { User } from "./userTypes";
// import { AuthRequest } from "../middlewares/authenticate";

// export const createUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { name, email, password } = req.body;
//   try {
//     if (!name || !email || !password) {
//       const error = createHttpError(400, "All fields are required");
//       return next(error);
//     }

//     // chech the existing user
//     const user = await userModel.findOne({ email });
//     if (user) {
//       const error = createHttpError(400, "User already exists");
//       return next(error);
//     }

//     // hashing the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser: User = await userModel.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     // token generation JWT
//     const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
//       expiresIn: "7d",
//       algorithm: "HS256",
//     });

//     // await newUser.save();

//     res.status(201).json({ accessToekn: token });
//   } catch (error) {
//     console.error("Error:", error);
//     return next(createHttpError(500, "Error while creating user"));
//   }
// };

// export const loginUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       const error = createHttpError(400, "Email and password are required");
//       return next(error);
//     }

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       const error = createHttpError(401, "Invalid credentials");
//       return next(error);
//     }

//     // compare hashed passwords
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       const error = createHttpError(401, "Invalid credentials");
//       return next(error);
//     }
//     // token generation JWT
//     const token = sign({ sub: user._id }, config.jwtSecret as string, {
//       expiresIn: "7d",
//       algorithm: "HS256",
//     });
//     const _req = req as AuthRequest;
//     console.log(_req.userId, "userId");
//     res.status(201).json({ accessToekn: token });
//   } catch (error) {
//     console.log(error);
//   }
// };
