import express from "express";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.ts";
import { createContact, deleteContact, getAllContacts, searchContact, updateContact } from "./controllers/contact.controller.ts";
import runAllMiddleware from "./middlewares/all.middleware.ts";
import { type Request, type Response } from "express"

dotenv.config()

const app = express();


runAllMiddleware(app)

const PORT = Number(process.env.PORT) ||5000;


app.post("/create", createContact);

app.get("/", (req:Request, res:Response)=>{
    res.json({message:"hello"})
});

app.delete("/delete/:id",  deleteContact);

app.put("/edit/:id",  updateContact);


app.get("/search/:character", searchContact);



app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

