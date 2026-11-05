import type { Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { requestIdMiddleware } from "./request-id.middleware.js";

const runMiddleware = () => {
  const request = { headers: { "x-request-id": "untrusted-client-id" } } as unknown as Request;
  const response = { setHeader: vi.fn() } as unknown as Response;

  requestIdMiddleware(request, response, vi.fn());

  return { request, response };
};

describe("requestIdMiddleware", () => {
  it("sets a generated request id on the request and response header", () => {
    const { request, response } = runMiddleware();

    expect(request.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(request.id).not.toBe("untrusted-client-id");
    expect(response.setHeader).toHaveBeenCalledWith("x-request-id", request.id);
  });

  it("generates a unique id for each request", () => {
    const first = runMiddleware();
    const second = runMiddleware();

    expect(first.request.id).not.toBe(second.request.id);
  });
});
