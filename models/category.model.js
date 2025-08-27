import { prisma } from "./prismaClient.js";

export const CategoryModel = {
  findAll: () => prisma.category.findMany(),

  create: (data) => prisma.category.create({ data }),

  update: (id, data) =>
    prisma.category.update({
      where: { id: Number(id) },
      data,
    }),

  delete: (id) =>
    prisma.category.delete({
      where: { id: Number(id) },
    }),
};
