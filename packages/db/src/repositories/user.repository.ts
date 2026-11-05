import type { Role } from "@context-bot/core";

import { prisma } from "../client.js";

export const userRepository = {
  create: (data: { username: string; passwordHash: string; role: Role }) => {
    return prisma.user.create({ data });
  },

  findByUsername: (username: string) => {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  findById: (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },
};
