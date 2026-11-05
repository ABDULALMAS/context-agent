import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { Role } from "@context-bot/core";

import { AppError } from "../errors/app-error.js";
import { requireRole } from "./require-role.middleware.js";

const request = {} as Request;

const responseWithUser = (user: { id: string; username: string; role: Role }) =>
  ({ locals: { user } }) as unknown as Response;

describe("requireRole", () => {
  it("continues when the authenticated user has an allowed role", () => {
    const next = vi.fn();

    requireRole(Role.enum.ADMIN)(
      request,
      responseWithUser({ id: "user-id", username: "admin", role: Role.enum.ADMIN }),
      next,
    );

    expect(next).toHaveBeenCalledOnce();
  });

  it("throws FORBIDDEN when the user does not have an allowed role", () => {
    const next = vi.fn();
    const checkRole = requireRole(Role.enum.ADMIN);
    let thrown: unknown;

    try {
      checkRole(
        request,
        responseWithUser({ id: "user-id", username: "founder", role: Role.enum.FOUNDER }),
        next,
      );
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(AppError);
    expect(thrown).toMatchObject({ code: "FORBIDDEN", status: 403 });
    expect(next).not.toHaveBeenCalled();
  });
});
