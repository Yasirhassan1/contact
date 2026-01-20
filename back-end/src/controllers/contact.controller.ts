import { type Response } from "express";
import Contact from "../models/contact.model.js";

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

