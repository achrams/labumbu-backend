import { prisma } from "./prismaClient.js";

export const ProductModel = {
  findAll: () => prisma.product.findMany(),

  findById: (id) =>
    prisma.product.findUnique({
      where: { id: Number(id) },
    }),

  create: (data) => prisma.product.create({ data }),

  update: (id, data) =>
    prisma.product.update({
      where: { id: Number(id) },
      data,
    }),

  delete: (id) =>
    prisma.product.delete({
      where: { id: Number(id) },
    }),
};
