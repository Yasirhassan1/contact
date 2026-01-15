import { type NextFunction, type Request, type Response } from "express"

export const writeLog = (req: Request, res: Response, next: NextFunction) => { 
    const logEntry = `IP: ${req.ip} | Method: ${req.method} | Path: ${req.url} | Time: ${new Date().toISOString()}`;
    console.log(logEntry); 
    next();
}