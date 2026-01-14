import express from "express";
import dotenv from 'dotenv'
import type { Request, Response } from "express";
import mongoose from "mongoose";
dotenv.config()

const app = express();
const PORT = Number(process.env.PORT) ||5000;
app.use(express.json());

try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.log("MongoDB connection error:", err);
  }



app.get("/", (req:Request, res:Response)=>{
    res.json({
        name:"Yasir",
        semester:"6th",
        gender:"male"
    })
})



app.listen(PORT, ()=>{
    console.log("App is running on port ", PORT)
})

