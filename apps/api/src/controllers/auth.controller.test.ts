import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ErrorCode } from "@context-bot/core";

import { authService } from "../services/auth.service.js";
import { createErrorMiddleware } from "../middleware/error.middleware.js";
import { authController } from "./auth.controller.js";

vi.mock("../services/auth.service.js", () => ({
  authService: {
    login: vi.fn(),
    validateSession: vi.fn(),
    logout: vi.fn(),
  },
}));

const createResponse = () => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  cookie: vi.fn().mockReturnThis(),
  clearCookie: vi.fn().mockReturnThis(),
  locals: {},
});

const invokeLogin = async (credentials: unknown) => {
  const request = { body: credentials } as Request;
  const response = createResponse();

  try {
    await authController.login(request, response as unknown as Response);
  } catch (error) {
    createErrorMiddleware({ error: vi.fn() } as never)(
      error,
      request,
      response as unknown as Response,
      vi.fn(),
    );
  }

  return response;
};

describe("authController.login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authService.login).mockResolvedValue(null);
  });

  it("returns the same invalid credentials envelope for unknown users and wrong passwords", async () => {
    const unknownUserResponse = await invokeLogin({ username: "unknown", password: "secret" });
    const wrongPasswordResponse = await invokeLogin({ username: "known", password: "wrong" });

    expect(unknownUserResponse.status).toHaveBeenCalledWith(401);
    expect(wrongPasswordResponse.status).toHaveBeenCalledWith(401);
    expect(unknownUserResponse.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: "Invalid username or password.",
      },
    });
    expect(wrongPasswordResponse.json).toHaveBeenCalledWith({
      error: {
        code: ErrorCode.INVALID_CREDENTIALS,
        message: "Invalid username or password.",
      },
    });
  });
});
