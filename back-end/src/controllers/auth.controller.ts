import { type Request, type Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (email && password) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }

      const newUser = await User.create({
        email,
        password,
      });

      const JWT_SECRET = process.env.JWT_SECRET as string;
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
        expiresIn: "10m",
      });

      res.status(200).json({
        success: true,
        message: "User created successfully",
        token,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Missing credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Email" });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "10m",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};