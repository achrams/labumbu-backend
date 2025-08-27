import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

export default async function productRoutes(fastify) {
  fastify.get("/products", getAllProducts);
  fastify.get("/products/:id", getProductById);
  fastify.post(
    "/products",
    { preHandler: fastify.authenticate },
    createProduct
  );
  fastify.put(
    "/products/:id",
    { preHandler: fastify.authenticate },
    updateProduct
  );
  fastify.delete(
    "/products/:id",
    { preHandler: fastify.authenticate },
    deleteProduct
  );
}
