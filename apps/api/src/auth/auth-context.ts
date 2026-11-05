import type { Response } from "express";
import { ErrorCode } from "@context-bot/core";
import type { AuthUser } from "@context-bot/core";

import { AppError } from "../errors/app-error.js";

type AuthLocals = {
  user?: AuthUser;
};

export const authContext = {
  setUser: (res: Response, user: AuthUser): void => {
    (res.locals as AuthLocals).user = user;
  },

  requireUser: (res: Response): AuthUser => {
    const user = (res.locals as AuthLocals).user;

    if (!user) {
      throw new AppError(ErrorCode.UNAUTHENTICATED, 401, "Authentication required.");
    }

    return user;
  },
};
