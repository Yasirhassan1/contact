import { type Request, type Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import z from "zod";
import { LoginValidationSchema } from "../validation/validation.schema.ts";
export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
     try{

    LoginValidationSchema.parse({email, password})

    }
    catch(error){
     if (error instanceof z.ZodError) {
      console.log(error.issues[0]?.message)
        return res.status(400).json({
          success:false,
          message: error.issues[0]?.message
        })
      
    } else {
      console.error("Unexpected error: ", error);
    }
    }
   

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
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      }).json({
        success: true,
        message: "User created successfully",
        isLoggedIn: true
      });
     
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const JWT_SECRET = process.env.JWT_SECRET as string;

  try {
    const { email, password } = req.body;
    try{

    LoginValidationSchema.parse({email, password})

    }
    catch(error){
     if (error instanceof z.ZodError) {
      console.log(error.issues[0]?.message)
        return res.status(400).json({
          success:false,
          message: error.issues[0]?.message
        })
      
    } else {
      console.error("Unexpected error: ", error);
    }
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
      secure: process.env.NODE_ENV === "production",
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
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/"
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
