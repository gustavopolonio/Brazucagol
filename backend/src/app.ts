import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { ZodError } from "zod";
import { env } from "./env";
import { protectedRoutes } from "./plugins/protectedRoutes";
import { authRoutes } from "./routes/auth";
import { publicPlayersRoutes } from "./routes/players";
import { clubsRoutes } from "./routes/clubs";
import { cupsRoutes } from "./routes/cups";
import { leaguesRoutes } from "./routes/leagues";
import { adminRoutes } from "./plugins/adminRoutes";
import { startSocketServer } from "./sockets";

const fastify = Fastify({
  logger: true,
});

// Configure CORS policies
fastify.register(fastifyCors, {
  origin: env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400,
});

// Non protected routes
fastify.register(authRoutes);
fastify.register(publicPlayersRoutes);
fastify.register(clubsRoutes);
fastify.register(cupsRoutes);
fastify.register(leaguesRoutes);

// Protected routes (logged-in users)
fastify.register(protectedRoutes);

// Admin routes (logged-in + admin)
fastify.register(adminRoutes);

startSocketServer(fastify);

// Error 500 handler
fastify.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "ValidationError",
      message: "Invalid request data",
      issues: error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  return reply.status(500).send({
    error: "InternalServerError",
    message: "Unexpected error",
  });
});

fastify.listen({ port: env.PORT }, (err) => {
  if (err) throw err;
  console.log(`Server listening on port: ${env.PORT}`);
});
