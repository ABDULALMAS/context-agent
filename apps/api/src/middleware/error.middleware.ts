import { ErrorCode, ErrorEnvelope } from "@context-bot/core";
import type { ErrorRequestHandler } from "express";
import type { Logger } from "pino";
import { ZodError } from "zod";

import { AppError } from "../errors/app-error.js";

export const createErrorMiddleware =
  (logger: Logger): ErrorRequestHandler =>
  (error, req, res, _next) => {
    if (error instanceof AppError) {
      const body = ErrorEnvelope.parse({
        error: {
          code: error.code,
          message: error.message,
          ...(error.details !== undefined && { details: error.details }),
        },
      });

      return res.status(error.status).json(body);
    }

    if (error instanceof ZodError) {
      const body = ErrorEnvelope.parse({
        error: {
          code: ErrorCode.VALIDATION_FAILED,
          message: "Invalid request.",
          details: error.issues.map(({ path, message }) => ({ path, message })),
        },
      });

      return res.status(400).json(body);
    }

    const errorName = error instanceof Error ? error.name : "UnknownError";
    logger.error({ requestId: req.id, errorName }, "Unhandled API error");

    const body = ErrorEnvelope.parse({
      error: {
        code: ErrorCode.INTERNAL,
        message: "Internal server error.",
      },
    });

    return res.status(500).json(body);
  };
