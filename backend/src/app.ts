import Fastify from 'fastify';
import fastifyCors from "@fastify/cors";
import { ZodError } from 'zod';
import { env } from "./env";
import { auth } from './lib/auth';

const fastify = Fastify({
  logger: true
});

// Configure CORS policies
fastify.register(fastifyCors, {
  origin: env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With"
  ],
  credentials: true,
  maxAge: 86400
});

// Error 500 handler
fastify.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: "ValidationError",
      message: "Invalid request data",
      issues: error.issues.map(issue => ({
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

// Register authentication endpoint
fastify.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      // Construct request URL
      const url = new URL(request.url, `http://${request.headers.host}`);

      // Convert Fastify headers to standard Headers object
      const headers = new Headers();
      Object.entries(request.headers).forEach(([key, value]) => {
        if (value) headers.append(key, value.toString());
      });
      // Create Fetch API-compatible request
      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
      });
      // Process authentication request
      const response = await auth.handler(req);
      // Forward response to client
      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      reply.send(response.body ? await response.text() : null);
    } catch (error) {
      console.log("Authentication Error:", error);
      reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE"
      });
    }
  }
});

fastify.listen({ port: env.PORT }, (err) => {
  if (err) throw err;
  console.log(`Server listening on port: ${env.PORT}`);
});
