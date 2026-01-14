import express from "express";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.ts";
import { createContact, deleteContact, getAllContacts, searchContact, updateContact } from "./controllers/contact.controller.ts";
import { corsMiddleware } from "./middlewares/cors.middleware.ts";
import { writeLog } from "./middlewares/log.middleware.ts";
import { rateLimmiter } from "./middlewares/limmiter.middleware.ts";

dotenv.config()

const app = express();

app.use(corsMiddleware);

app.use(express.json());

app.use(writeLog);
app.use(rateLimmiter);


const PORT = Number(process.env.PORT) ||5000;

connectDB();


app.post("/create", createContact);

app.get("/", getAllContacts);

app.delete("/delete/:id",  deleteContact);

app.put("/edit/:id",  updateContact);


app.get("/search/:character", searchContact);



app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

