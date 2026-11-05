import type { Request, Response, NextFunction } from "express";

import { authService } from "../services/auth.service.js";
import { loginSchema } from "../validators/auth.validator.js";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_COOKIE_MAX_AGE,
} from "../config/session.js";

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = loginSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({
          error: "Invalid request.",
        });
        return;
      }

      const session = await authService.login(result.data);

      if (!session) {
        res.status(401).json({
          error: "Invalid username or password.",
        });
        return;
      }

      res.cookie(SESSION_COOKIE_NAME, session.token, {
        ...SESSION_COOKIE_OPTIONS,
        maxAge: SESSION_COOKIE_MAX_AGE,
      });

      res.status(200).json({
        user: session.user,
      });
    } catch (error) {
      next(error);
    }
  },

  me: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({
        user: res.locals.user,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.cookies?.[SESSION_COOKIE_NAME];

      if (token) {
        await authService.logout(token);
      }

      res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

      res.status(200).json({
        message: "Logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  },
};
