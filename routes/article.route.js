import {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

async function articleRoutes(fastify, options) {
  fastify.get("/articles", getAllArticles);
  fastify.get("/articles/:id", getArticleById);
  fastify.post(
    "/articles",
    { preHandler: fastify.authenticate },
    createArticle
  );
  fastify.put(
    "/articles/:id",
    { preHandler: fastify.authenticate },
    updateArticle
  );
  fastify.delete(
    "/articles/:id",
    { preHandler: fastify.authenticate },
    deleteArticle
  );
}

export default articleRoutes;
