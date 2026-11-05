import { prisma } from "../client.js";

export const userRepository = {
  create: (data: { username: string; passwordHash: string }) => {
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
