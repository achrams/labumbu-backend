import fp from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";

export default fp(async (fastify, opts) => {
  fastify.register(fastifyJWT, {
    secret: process.env.JWT_SECRET || "ladarajaya88",
  });

  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});
