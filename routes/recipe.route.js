import {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipe.controller.js";

export default async function recipeRoutes(fastify) {
  fastify.get("/recipes", getAllRecipes);
  fastify.get("/recipes/:id", getRecipeById);
  fastify.post("/recipes", { preHandler: fastify.authenticate }, createRecipe);
  fastify.put(
    "/recipes/:id",
    { preHandler: fastify.authenticate },
    updateRecipe
  );
  fastify.delete(
    "/recipes/:id",
    { preHandler: fastify.authenticate },
    deleteRecipe
  );
}
