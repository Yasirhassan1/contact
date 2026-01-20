import { type Request, type Response } from "express";
import Contact from "../models/contact.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import type AuthRequest from "../middlewares/verify-token.middleware.js";

export const getAllContacts = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not identified" });
    }

    const contacts = await Contact.find({ owner: userId }).select(
      "_id name phoneNo email"
    );

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createContact = async (req: AuthRequest, res: Response) => {
  const { name, phoneNo, email } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not identified" });
  }

  try {
    await Contact.create({
      name,
      phoneNo,
      email,
      owner: userId,
    });

    const contacts = await Contact.find({ owner: userId }).select(
      "_id name phoneNo email"
    );

    res.json({
      contacts,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
    });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const contactId = req.params.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not identified" });
  }

  if (!contactId) {
    return res
      .status(400)
      .json({ success: false, message: "Contact ID is required" });
  }

  try {
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      owner: userId,
    });

    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or you don't have permission to delete it.",
      });
    }

    const contacts = await Contact.find({ owner: userId }).select(
      "_id name phoneNo email"
    );

    res.json({
      success: true,
      message: "Contact deleted successfully",
      contacts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

export const updateContact = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const contactId = req.params.id;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not identified" });
  }

  if (!contactId) {
    return res
      .status(400)
      .json({ success: false, message: "Contact ID is required" });
  }

  try {
    const { name, phoneNo, email } = req.body;

    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId },
      { name, phoneNo, email },
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or unauthorized",
      });
    }

    const contacts = await Contact.find({ owner: userId }).select(
      "_id name phoneNo email"
    );

    res.json({ success: true, contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};

export const searchContact = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "User not identified" });
  }

  try {
    const character = req.params.character;
    const contacts = await Contact.find({ owner: userId }).select(
      "_id name phoneNo email"
    );

    if (!character) {
      return res.json({ success: false, id: null });
    }

    const search = character.toLowerCase();

    const targetIds = contacts
      .filter((cur) => cur.name.toLowerCase().includes(search))
      ?.map((cur) => cur.id);

    if (targetIds == null) {
      return res.json({
        success: false,
        id: null,
      });
    }

    res.json({
      success: true,
      ids: targetIds,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

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
        expiresIn: "1m",
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
      expiresIn: "1m",
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