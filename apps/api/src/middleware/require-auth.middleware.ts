import type { Request, Response, NextFunction } from "express";
import { ErrorCode } from "@context-bot/core";

import { AppError } from "../errors/app-error.js";
import { authContext } from "../auth/auth-context.js";
import { authService } from "../services/auth.service.js";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "../config/session.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    throw new AppError(ErrorCode.UNAUTHENTICATED, 401, "Authentication required.");
  }

  const user = await authService.validateSession(token);

  if (!user) {
    res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

    throw new AppError(ErrorCode.UNAUTHENTICATED, 401, "Session expired or invalid.");
  }

  authContext.setUser(res, user);

  next();
};
