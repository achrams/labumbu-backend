import Fastify from "fastify";
import jwtPlugin from "./plugins/jwt.js";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";

import authRoutes from "./routes/auth.route.js";
import articleRoutes from "./routes/article.route.js";
import productRoutes from "./routes/product.route.js";
import recommendationRoutes from "./routes/recommendation.route.js";
import recipeRoutes from "./routes/recipe.route.js";

import path from "path";
import { fileURLToPath } from "url";
import fastifyFormbody from "@fastify/formbody";
import categoryRoutes from "./routes/category.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const fastify = Fastify({ logger: true });

// Register multipart (tidak global, tapi dibutuhkan untuk preHandler di route)
fastify.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024, // maksimal 10MB
  },
});

// Serve file gambar lokal (misalnya dari folder uploads)
fastify.register(fastifyStatic, {
  root: path.join(__dirname, "uploads"),
  prefix: "/uploads/",
});

const origin = process.env.ORIGIN;

await fastify.register(cors, {
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
});

// JWT plugin
await fastify.register(fastifyFormbody);
await fastify.register(jwtPlugin);

// Default health check
fastify.get("/", () => {
  return { message: "OK" };
});

// Register routes
await fastify.register(authRoutes);
await fastify.register(articleRoutes);
await fastify.register(productRoutes);
await fastify.register(recipeRoutes);
await fastify.register(recommendationRoutes);
await fastify.register(categoryRoutes);

// Jalankan server
const port = process.env.PORT || 40001;
fastify.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server running at ${address}`);
});
