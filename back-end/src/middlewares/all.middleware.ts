import express, {type Express}  from "express";
import { corsMiddleware } from "./cors.middleware.js";
export default function runAllMiddleware(app:Express){
    app.use(express.json());
    app.use(corsMiddleware);
}