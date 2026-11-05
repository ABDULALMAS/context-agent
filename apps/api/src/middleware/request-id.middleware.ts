import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = randomUUID();

  req.id = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};
