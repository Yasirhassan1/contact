import { type NextFunction, type Request, type Response } from "express"
import { appendFile } from "node:fs"
export const  writeLog  = (req:Request, res:Response, next:NextFunction)=>{ 
    appendFile("log.txt",`IP: ${req.ip} Method: ${req.method} Time: ${String(new Date())}\n`, ()=>{

    })
    next()
}