import type { NextFunction, Request, Response } from "express";
import { ErrorCode } from "@context-bot/core";
import type { Role } from "@context-bot/core";

import { authContext } from "../auth/auth-context.js";
import { AppError } from "../errors/app-error.js";

export const requireRole = (...roles: Role[]) => {
  return (_req: Request, res: Response, next: NextFunction): void => {
    const user = authContext.requireUser(res);

    if (!roles.includes(user.role)) {
      throw new AppError(
        ErrorCode.FORBIDDEN,
        403,
        "You do not have permission to perform this action.",
      );
    }

    next();
  };
};
