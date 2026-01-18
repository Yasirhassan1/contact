import { type NextFunction, type Request, type Response } from "express";

export const protectApi = (req: Request, res: Response, next: NextFunction) => {
  const clientKey = req.headers["api-key"] as string;
  const serverKey = process.env.API_SECRET_KEY as string;
  if (clientKey !== serverKey) {
    return res.status(403).json({
      error: "Access Denied",
      message: "You are not authorized to view this data directly.",
    });
  }
  next();
};
