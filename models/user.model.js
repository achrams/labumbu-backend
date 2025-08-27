import { prisma } from "./prismaClient.js";

export const UserModel = {
  findAll: () => prisma.user.findMany(),

  findByEmail: (email) =>
    prisma.user.findUnique({
      where: { email: String(email) },
    }),

  findById: (id) => prisma.user.findUnique({ where: { id } }),

  create: (data) => prisma.user.create({ data }),

  update: (id, data) =>
    prisma.user.update({
      where: { id: Number(id) },
      data,
    }),

  delete: (id) =>
    prisma.user.delete({
      where: { id: Number(id) },
    }),
};
