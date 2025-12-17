'use client';

import { signIn, useSession, signOut, getSession } from "@/lib/auth-client";

export default function Home() {
  const { data, isPending } = useSession();
  console.log(data);

  async function getUserSession() {
    const session = await getSession();
    console.log('session', session);
  }

  getUserSession();

  async function handleSignIn() {
    await signIn.social({
      provider: 'google',
      callbackURL: process.env.NEXT_PUBLIC_CLIENT_URL
    });
  }

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div>
      {isPending ? 'Cargando...' : (
        <>
          {data?.session ? (
            <button onClick={handleSignOut}>Sign out</button>
          ) : (
            <button onClick={handleSignIn}>Sign in</button>
          )}
        </>
      )}
    </div>
  );
}
