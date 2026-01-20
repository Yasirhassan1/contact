import { type Request, type Response } from "express";
import Contact from "../models/contact.model.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import type AuthRequest from "../middlewares/verify-token.middleware.js";

export const getAllContacts = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Get the userId from the 'req.user' object attached by your middleware
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User not identified" });
    }

    // 2. Use .find() to get ALL contacts for this specific user
    // 3. Use .select() to only get the fields you need
    const contacts = await Contact
      .find({ owner: userId })
      .select("_id name phoneNo email");

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
      name: name,
      phoneNo: phoneNo,
      email: email,
      owner: userId,
    });

    const contacts = await Contact
      .find({ owner: userId })
      .select("_id name phoneNo email");

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

  try {
    // 1. Delete ONLY if the ID matches AND the owner matches
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

    // 2. Fetch the REMAINING contacts for THIS user only
    const contacts = await Contact
      .find({ owner: userId })
      .select("_id name phoneNo email");

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

  try {
    const { name, phoneNo, email } = req.body;

    // 1. Update ONLY if ID matches AND the owner matches
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: userId }, // The Filter
      { name, phoneNo, email }, // The Data to update
      { new: true }, // Options: return the modified document
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found or unauthorized",
      });
    }

    // 2. Fetch only THIS user's contacts for the frontend
    const contacts = await Contact
      .find({ owner: userId })
      .select("_id name phoneNo email");

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
    const contacts = await Contact
      .find({ owner: userId })
      .select("_id name phoneNo email");

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
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "User already exists" });
      }
      // 1. Create the user in the database
      const newUser = await userModel.create({
        email: email,
        password: password, // Still plain text for now (not recommended)
      });

      // 4. GENERATE THE TOKEN (Essential for the login system to work)
      const JWT_SECRET = process.env.JWT_SECRET as string;
      const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
        expiresIn: "1m",
      });

      res.status(200).json({
        success: true,
        message: "User created successfully",
        token: token, // This is the "Passport" for your frontend
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
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const user = await userModel.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email" });
    }

    // Check Password
    const isMatch = password === user.password; // Note: Use bcrypt.compare later!
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    // Generate Token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1m" });

    // Send response and RETURN so the code below doesn't run
    return res.json({ 
      success: true, 
      message: "Login successful", 
      token 
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};