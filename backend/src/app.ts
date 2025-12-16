import Fastify from 'fastify';
import { env } from "./env";

const fastify = Fastify({
  logger: true
});

fastify.get('/', async (request, reply) => {
  reply.type('application/json').code(200);
  return { hello: 'world' };
});

fastify.listen({ port: env.PORT }, (err) => {
  if (err) throw err;
  console.log(`Server listening on port: ${env.PORT}`);
});
