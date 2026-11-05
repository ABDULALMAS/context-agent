import { afterEach, describe, expect, it, vi } from "vitest";

import { ErrorCode, MeResponse } from "@context-bot/core";

import { ApiError, apiClient } from "./api-client.js";

describe("apiClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns an ApiError for an empty 204 response that violates the schema", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(apiClient.get("/auth/me", MeResponse)).rejects.toMatchObject({
      name: "ApiError",
      code: ErrorCode.INTERNAL,
      status: 204,
    });
  });

  it("returns a safe ApiError for a non-JSON server response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("<html>Bad Gateway</html>", {
          status: 502,
          headers: { "content-type": "text/html" },
        }),
      ),
    );

    const result = apiClient.get("/auth/me", MeResponse);

    await expect(result).rejects.toBeInstanceOf(ApiError);
    await expect(result).rejects.toMatchObject({
      code: ErrorCode.INTERNAL,
      status: 502,
      message: "The server returned an invalid response.",
    });
  });
});
