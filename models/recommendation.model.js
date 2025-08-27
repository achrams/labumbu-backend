import { prisma } from "./prismaClient.js";

export const RecommendationModel = {
  findAll: () =>
    prisma.recommendation.findMany({
      include: {
        recipes: true,
      },
    }),

  create: (data) => prisma.recommendation.create({ data }),

  update: (id, data) =>
    prisma.recommendation.update({
      where: { id: Number(id) },
      data,
    }),

  delete: (id) =>
    prisma.recommendation.delete({
      where: { id: Number(id) },
    }),
};
