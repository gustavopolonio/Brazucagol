import { createAuthClient } from "better-auth/react";

export const { signIn, useSession, signOut, getSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});
