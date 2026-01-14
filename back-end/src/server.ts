import express from "express";
import dotenv from 'dotenv'
import connectDB from "./dbConnection/dbConnection.js";
import { getAllContacts } from "./controllers/contact.controller.js";

dotenv.config()

const app = express();
const PORT = Number(process.env.PORT) ||5000;
app.use(express.json());


connectDB();



app.get("/", getAllContacts)


app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

