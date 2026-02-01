import { auth } from "@/lib/auth";
import { db } from "@/lib/drizzle";
import { getPlayerIdByUserId } from "@/repositories/playerRepository";

interface ResolvePlayerIdFromSocketTokenProps {
  token: string | undefined;
}

export async function resolvePlayerIdFromSocketToken({
  token,
}: ResolvePlayerIdFromSocketTokenProps): Promise<string | null> {
  if (!token) {
    return null;
  }

  const headers = new Headers();
  headers.set("cookie", `better-auth.session_token=${token}`);

  const session = await auth.api.getSession({ headers });
  console.log("SESSION FROM SOCKET:", session);

  if (!session?.user?.id || !session.user.hasPlayer) {
    return null;
  }

  const player = await getPlayerIdByUserId({ db, userId: session.user.id });

  return player?.id ?? null;
}
