import type { Express } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { authRoutes } from "./routes/index.js";

export const app: Express = express();

app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use(errorMiddleware);
