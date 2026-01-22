import { type Request, type Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should be atleast 8 characters",
      });
    }

    if (email && password) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
      const salt = 10;
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await User.create({
        email,
        password: hashedPassword,
      });

      const JWT_SECRET = process.env.JWT_SECRET as string;
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
        expiresIn: "15m",
      });

      res.status(200).cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      }).json({
        success: true,
        message: "User created successfully",
        isLoggedIn: true
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
      return res.status(401).json({ success: false, message: "Invalid Email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "15m",
    });

    return res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 900000,
    }).json({
      success: true,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const isLoggedIn = async (req: Request, res: Response) => {
  res.status(200).json({
    authenticated: true
  })
}

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/"
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
