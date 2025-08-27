import * as RecommendationService from "../services/recommendation.service.js";

export const getAllRecommendations = async (req, reply) => {
  const recommendations = await RecommendationService.getAll();
  return reply.send(recommendations);
};

export const createRecommendation = async (req, reply) => {
  const { recipes } = req.body;
  console.log("Creating recommendation with recipes:", recipes);
  const founded = await RecommendationService.getAll();
  if (founded.length > 0) {
    const id = founded[0].id;
    const updated = await RecommendationService.update(id, {
      recipes: { set: recipes.connect },
    });

    if (!updated) {
      return reply.code(404).send({ message: "Recommendation not found" });
    }
    return reply.code(201).send(updated);
  }
  if (!recipes || recipes.length === 0) {
    return reply.code(400).send({ message: "Recipes are required" });
  }
  if (!founded[0]) {
    const recommendation = await RecommendationService.create({ recipes });
    return reply.code(201).send(recommendation);
  }
};

export const updateRecommendation = async (req, reply) => {
  const { id } = req.params;
  const recommendation = await RecommendationService.update(id, req.body);
  return reply.send(recommendation);
};

export const deleteRecommendation = async (req, reply) => {
  const { id } = req.params;
  await RecommendationService.remove(id);
  return reply.code(204).send();
};
