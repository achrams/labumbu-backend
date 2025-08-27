import {
  getAllRecommendations,
  createRecommendation,
  updateRecommendation,
  deleteRecommendation,
} from "../controllers/recommendation.controller.js";

export default async function recommendationRoutes(fastify) {
  fastify.get("/recommendations", getAllRecommendations);
  fastify.post(
    "/recommendations",
    { preHandler: fastify.authenticate },
    createRecommendation
  );
  fastify.put(
    "/recommendations/:id",
    { preHandler: fastify.authenticate },
    updateRecommendation
  );
  fastify.delete(
    "/recommendations/:id",
    { preHandler: fastify.authenticate },
    deleteRecommendation
  );
}
