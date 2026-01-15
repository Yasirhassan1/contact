import express from "express";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.ts";
import { getAllContacts, createContact, deleteContact, updateContact, searchContact } from "./controllers/contact.controller.ts";
import runAllMiddleware from "./middlewares/all.middleware.ts";

dotenv.config()

const app = express();
const PORT = Number(process.env.PORT) || 5000;

runAllMiddleware(app)

connectDB();
app.post("/create", createContact);
app.get("/", getAllContacts);
app.delete("/delete/:id",  deleteContact);
app.put("/edit/:id",  updateContact);
app.get("/search/:character", searchContact);
app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

