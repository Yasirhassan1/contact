import express from "express";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.ts";
import { createContact, deleteContact, getAllContacts, searchContact, updateContact } from "./controllers/contact.controller.ts";
import runAllMiddleware from "./middlewares/all.middleware.ts";
import cors from "cors";

dotenv.config()

const app = express();

runAllMiddleware(app)

const PORT = Number(process.env.PORT) ||5000;

connectDB();
let whitelist = ['https://contact-3k4v.vercel.app', 'http://localhost:3000']
let corsOptions = {
  origin: function (origin:any, callback:any) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.post("/create", createContact);

app.get("/", cors(corsOptions), getAllContacts);

app.delete("/delete/:id",  deleteContact);

app.put("/edit/:id",  updateContact);


app.get("/search/:character", searchContact);



app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

