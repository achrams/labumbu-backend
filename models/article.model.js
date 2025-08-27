import { prisma } from "./prismaClient.js";

export const ArticleModel = {
  findAll: () => prisma.article.findMany(),

  findById: (id) =>
    prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        recommendedRecipes: true,
        recommendedProducts: true,
      },
    }),

  create: (data) => prisma.article.create({ data }),

  update: (id, data) =>
    prisma.article.update({
      where: { id: Number(id) },
      data,
    }),

  delete: (id) =>
    prisma.article.delete({
      where: { id: Number(id) },
    }),
};
