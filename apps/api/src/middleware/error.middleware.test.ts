import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { ErrorCode, LoginRequest } from "@context-bot/core";

import { AppError } from "../errors/app-error.js";
import { createErrorMiddleware } from "./error.middleware.js";

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
});

const invokeMiddleware = (error: unknown) => {
  const response = createResponse();

  createErrorMiddleware({ error: vi.fn() } as never)(
    error,
    {} as Request,
    response as unknown as Response,
    vi.fn(),
  );

  return response;
};

describe("errorMiddleware", () => {
  it("maps AppError to its status and error envelope", () => {
    const response = invokeMiddleware(
      new AppError(ErrorCode.NOT_FOUND, 404, "Record not found.", { id: "missing" }),
    );

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.NOT_FOUND,
        message: "Record not found.",
        details: { id: "missing" },
      },
    });
  });

  it("maps ZodError to validation details with paths and messages", () => {
    let error: unknown;

    try {
      LoginRequest.parse({ username: "", password: "" });
    } catch (caught) {
      error = caught;
    }

    const response = invokeMiddleware(error);
    const body = response.json.mock.calls[0]?.[0];

    expect(response.status).toHaveBeenCalledWith(400);
    expect(body).toMatchObject({
      error: {
        code: ErrorCode.VALIDATION_FAILED,
        message: "Invalid request.",
        details: expect.arrayContaining([
          { path: ["username"], message: expect.any(String) },
          { path: ["password"], message: expect.any(String) },
        ]),
      },
    });
  });

  it("returns a generic internal error and logs its request id and name", () => {
    const logger = { error: vi.fn() };
    const response = createResponse();

    createErrorMiddleware(logger as never)(
      new Error("sensitive value"),
      { id: "request-id" } as Request,
      response as unknown as Response,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.INTERNAL,
        message: "Internal server error.",
      },
    });
    expect(logger.error).toHaveBeenCalledWith(
      { requestId: "request-id", errorName: "Error" },
      "Unhandled API error",
    );
    expect(JSON.stringify(logger.error.mock.calls)).not.toContain("sensitive value");
  });
});
