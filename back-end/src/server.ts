import express from "express";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.js";
import { getAllContacts, createContact, deleteContact, updateContact, searchContact, signUp, signIn } from "./controllers/contact.controller.js";
import runAllMiddleware from "./middlewares/all.middleware.js";
import { verifyToken } from "./middlewares/verify-token.middleware.ts";

dotenv.config()

const app = express();
const PORT = Number(process.env.PORT) || 5000;

runAllMiddleware(app)
connectDB();

app.post("/create", verifyToken, createContact);
app.get("/", verifyToken, getAllContacts);
app.delete("/delete/:id", verifyToken,  deleteContact);
app.put("/edit/:id", verifyToken,  updateContact);
app.get("/search/:character", verifyToken, searchContact);
app.post("/sign-up", signUp);
app.post("/sign-in", signIn);

app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

