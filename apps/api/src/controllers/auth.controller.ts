import type { Request, Response } from "express";
import {
  ErrorCode,
  LoginRequest,
  LoginResponse,
  MeResponse,
  LogoutResponse,
} from "@context-bot/core";

import { AppError } from "../errors/app-error.js";
import { authService } from "../services/auth.service.js";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_COOKIE_MAX_AGE,
} from "../config/session.js";

export const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const credentials = LoginRequest.parse(req.body);
    const session = await authService.login(credentials);

    if (!session) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401, "Invalid username or password.");
    }

    res.cookie(SESSION_COOKIE_NAME, session.token, {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: SESSION_COOKIE_MAX_AGE,
    });

    res.status(200).json(LoginResponse.parse({ user: session.user }));
  },

  me: async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(MeResponse.parse({ user: res.locals.user }));
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.[SESSION_COOKIE_NAME];

    if (token) {
      await authService.logout(token);
    }

    res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);

    res.status(200).json(LogoutResponse.parse({ message: "Logged out successfully." }));
  },
};
