import { prisma } from "./prismaClient.js";

export const RecipeModel = {
  findAll: () => prisma.recipe.findMany(),

  findById: (id) =>
    prisma.recipe.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        recommendedProducts: true,
      },
    }),

  create: (data) => prisma.recipe.create({ data }),

  update: (id, data) =>
    prisma.recipe.update({
      where: { id: Number(id) },
      data,
    }),

  delete: (id) =>
    prisma.recipe.delete({
      where: { id: Number(id) },
    }),
};
