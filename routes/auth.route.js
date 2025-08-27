import { register, login } from "../controllers/user.controller.js";

export default async function authRoutes(fastify, opts) {
  fastify.post("/auth/register", register);
  fastify.post("/auth/login", login);
}
