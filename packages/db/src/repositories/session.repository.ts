import { prisma } from "../client.js";

export const sessionRepository = {
  create: (data: {
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    absoluteExpiresAt: Date;
  }) => {
    return prisma.session.create({ data });
  },

  findByTokenHash: (tokenHash: string) => {
    return prisma.session.findUnique({
      where: { tokenHash },
      include: { user: true },
    });
  },

  updateActivity: (
    id: string,
    data: {
      lastSeenAt: Date;
      expiresAt: Date;
    },
  ) => {
    return prisma.session.update({
      where: { id },
      data,
    });
  },

  revoke: (tokenHash: string) => {
    return prisma.session.updateMany({
      where: {
        tokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },

  revokeAllForUser: (userId: string) => {
    return prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  },
};
