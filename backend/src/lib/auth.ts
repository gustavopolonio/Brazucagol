import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/drizzle";
import { env } from "@/env";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  trustedOrigins: [env.CLIENT_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true
  }),
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    }
  }
});
