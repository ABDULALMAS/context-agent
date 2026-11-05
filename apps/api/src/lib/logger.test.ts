import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";

import { createLogger, sensitiveRedactPaths } from "./logger.js";

describe("API logger", () => {
  it("redacts cookie, authorization, password, token and passwordHash values", () => {
    let output = "";
    const stream = new Writable({
      write(chunk: Buffer, _encoding, callback) {
        output += chunk.toString();
        callback();
      },
    });
    const logger = createLogger({
      level: "info",
      redact: sensitiveRedactPaths,
      transport: stream,
    });

    logger.info(
      {
        req: { headers: { cookie: "cookie-secret", authorization: "authorization-secret" } },
        res: { headers: { "set-cookie": "set-cookie-secret" } },
        credentials: {
          password: "password-secret",
          token: "token-secret",
          passwordHash: "password-hash-secret",
        },
      },
      "request completed",
    );

    expect(output).not.toContain("cookie-secret");
    expect(output).not.toContain("authorization-secret");
    expect(output).not.toContain("set-cookie-secret");
    expect(output).not.toContain("password-secret");
    expect(output).not.toContain("token-secret");
    expect(output).not.toContain("password-hash-secret");
  });
});
