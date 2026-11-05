import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";

import { sessionRepository, userRepository } from "@context-bot/db";
import type { AuthUser, LoginRequest } from "@context-bot/core";

type LoginSession = {
  token: string;
  user: AuthUser;
};

const IDLE_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const ABSOLUTE_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000;
const ACTIVITY_UPDATE_INTERVAL_MS = 15 * 60 * 1000;

const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export const authService = {
  login: async ({ username, password }: LoginRequest): Promise<LoginSession | null> => {
    const user = await userRepository.findUserWithPasswordHash(username);

    if (!user || !user.isActive) {
      return null;
    }

    const passwordValid = await argon2.verify(user.passwordHash, password);

    if (!passwordValid) {
      return null;
    }

    const token = randomBytes(32).toString("base64url");
    const now = new Date();

    const expiresAt = new Date(now.getTime() + IDLE_EXPIRY_MS);
    const absoluteExpiresAt = new Date(now.getTime() + ABSOLUTE_EXPIRY_MS);

    await sessionRepository.create({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt,
      absoluteExpiresAt,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
  },

  validateSession: async (token: string): Promise<AuthUser | null> => {
    const session = await sessionRepository.findByTokenHash(hashToken(token));

    if (!session) return null;

    const now = new Date();

    if (
      session.revokedAt ||
      session.expiresAt <= now ||
      session.absoluteExpiresAt <= now ||
      !session.user.isActive
    ) {
      return null;
    }

    const elapsed = now.getTime() - session.lastSeenAt.getTime();

    if (elapsed >= ACTIVITY_UPDATE_INTERVAL_MS) {
      const idleExpiry = new Date(now.getTime() + IDLE_EXPIRY_MS);

      const expiresAt = new Date(
        Math.min(idleExpiry.getTime(), session.absoluteExpiresAt.getTime()),
      );

      await sessionRepository.updateActivity(session.id, {
        lastSeenAt: now,
        expiresAt,
      });
    }

    return {
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
    };
  },

  logout: async (token: string) => {
    await sessionRepository.revoke(hashToken(token));
  },
};
