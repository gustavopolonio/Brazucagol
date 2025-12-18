import 'fastify';
import type { auth } from '../src/lib/auth';

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

declare module "fastify" {
  interface FastifyRequest {
    authSession?: AuthSession;
  }
}
