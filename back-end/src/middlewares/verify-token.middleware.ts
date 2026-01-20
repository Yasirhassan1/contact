import jwt from "jsonwebtoken"
import {type Request, type Response, type NextFunction } from "express";

export default interface AuthRequest extends Request {
  user?: any; 
}
export const verifyToken = (req:AuthRequest, res:Response, next:NextFunction)=>{
    const authHeader = req.headers["authorization"]
    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = authHeader?.split(' ')[1]; 
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Add user data to the request object
    next(); 
  } catch(error){
     console.log(error)
    return res.status(401).json({ success:false, message: `Invalid or Expired Token` });
   
  }
    

}