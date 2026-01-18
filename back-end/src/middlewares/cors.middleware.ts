import cors from "cors";
export const corsMiddleware = cors({
  origin: ["https://contact-3k4v.vercel.app", "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});
