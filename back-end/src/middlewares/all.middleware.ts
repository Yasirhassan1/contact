import express, {type Express}  from "express";
export default function runAllMiddleware(app:Express){
    app.use(express.json());
}