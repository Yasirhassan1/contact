import express from "express";
import dotenv from 'dotenv'
import runAllMiddleware from "./middlewares/all.middleware.ts";

import type { Request, Response } from "express";
dotenv.config()

const app = express();


runAllMiddleware(app)

const PORT = Number(process.env.PORT) ||5000;


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

