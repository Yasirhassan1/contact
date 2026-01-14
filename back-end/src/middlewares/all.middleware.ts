import express, {type Express}  from "express";
import { writeLog } from "../middlewares/log.middleware.ts";
import { rateLimmiter } from "../middlewares/limmiter.middleware.ts";
// import helmet from "helmet";
export default function runAllMiddleware(app:Express){
    // app.use(helmet())
    app.use(express.json());
    app.use(writeLog);
    app.use(rateLimmiter);
}