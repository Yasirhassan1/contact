import express, {type Express}  from "express";
import { corsMiddleware } from "./cors.middleware.ts";
import { writeLog } from "./log.middleware.ts";
import { rateLimmiter } from "./limmiter.middleware.ts";
export default function runAllMiddleware(app:Express){
    app.use(express.json());
    app.use(corsMiddleware);
    app.use(writeLog);
    app.use(rateLimmiter);
}