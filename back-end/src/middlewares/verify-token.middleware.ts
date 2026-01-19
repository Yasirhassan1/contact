import jwt from "jsonwebtoken"
import {type Request, type Response, type NextFunction } from "express";

export default interface AuthRequest extends Request {
  user?: any; // You can replace 'any' with { userId: string, role: string } later
}
export const verifyToken = (req:AuthRequest, res:Response, next:NextFunction)=>{
    const authHeader = req.headers["authorization"]
    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = authHeader?.split(' ')[1]; // Extract after 'Bearer'
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
    // Verify the signature using your secret key
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // Add user data to the request object
    next(); // Move to the actual route logic
  } catch(error){
     console.log(error)
    return res.status(401).json({ message: `Invalid or Expired Token` });
   
  }
    
  

}