import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const { signIn, useSession, signOut, getSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  plugins: [inferAdditionalFields({
    user: {
      hasPlayer: {
        type: "boolean"
      }
    }
  })],
});
