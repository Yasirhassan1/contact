import express, { type Express } from "express";
import { corsMiddleware } from "./cors.middleware.js";
import { writeLog } from "./log.middleware.js";
import { rateLimmiter } from "./limmiter.middleware.js";
import * as helmet from "helmet";
export default function runAllMiddleware(app: Express) {
  app.use((helmet as any).default());
  app.use(express.json());
  app.use(corsMiddleware);
  app.use(writeLog);
  if ((process.env.NODE_ENV as string) == "production") {
    app.set("trust proxy", 1);
  }

  app.use(rateLimmiter);
}
