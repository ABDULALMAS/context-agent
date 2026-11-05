import type { Request, Response, NextFunction } from "express";

import { authService } from "../services/auth.service.js";
import { SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from "../config/session.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies?.[SESSION_COOKIE_NAME];

    if (!token) {
      res.status(401).json({
        error: "Authentication required.",
      });
      return;
    }

    const user = await authService.validateSession(token);

    if (!user) {
      res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

      res.status(401).json({
        error: "Session expired or invalid.",
      });
      return;
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
