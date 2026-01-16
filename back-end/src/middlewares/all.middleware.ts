import express, {type Express}  from "express";
import { corsMiddleware } from "./cors.middleware.js";
import { writeLog } from "./log.middleware.js";
import { rateLimmiter } from "./limmiter.middleware.js";
import helmet from "helmet";
export default function runAllMiddleware(app:Express){
    app.use(helmet());
    app.use(express.json());
    app.use(corsMiddleware);
    app.use(writeLog);
    app.use(rateLimmiter);
}