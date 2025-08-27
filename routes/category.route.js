import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

export default async function categoryRoutes(fastify) {
  fastify.get("/categories", getAllCategories);
  fastify.post(
    "/categories",
    { preHandler: fastify.authenticate },
    createCategory
  );
  fastify.put(
    "/categories/:id",
    { preHandler: fastify.authenticate },
    updateCategory
  );
  fastify.delete(
    "/categories/:id",
    { preHandler: fastify.authenticate },
    deleteCategory
  );
}
