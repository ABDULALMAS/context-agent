import type { Express } from "express";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pino from "pino";
import { pinoHttp } from "pino-http";

import { env } from "./config/env.js";
import { createLogger, sensitiveRedactPaths } from "./lib/logger.js";
import { createErrorMiddleware } from "./middleware/error.middleware.js";
import { requestIdMiddleware } from "./middleware/request-id.middleware.js";
import { authRoutes } from "./routes/index.js";

export const app: Express = express();

const logger = createLogger({
  level: env.LOG_LEVEL,
  redact: sensitiveRedactPaths,
  ...(env.NODE_ENV === "development" && {
    transport: pino.transport({
      target: "pino-pretty",
      options: { colorize: true },
    }),
  }),
});

export { logger };

if (env.TRUST_PROXY_HOPS > 0) {
  app.set("trust proxy", env.TRUST_PROXY_HOPS);
}

app.use(requestIdMiddleware);
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.id,
    serializers: {
      req: (req) => ({
        method: req.method,
        path: new URL(req.url ?? "/", "http://localhost").pathname,
        id: req.id,
      }),
      res: (res) => ({ statusCode: res.statusCode }),
    },
    customProps: (_req, res) => {
      const locals = (res as typeof res & { locals?: { user?: { id?: string } } }).locals;

      return locals?.user?.id ? { userId: locals.user.id } : {};
    },
  }),
);

app.use(
  cors({
    origin: env.APP_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use(createErrorMiddleware(logger));
