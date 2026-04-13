import { type FastifyReply, type FastifyRequest } from "fastify";
import { type User } from "@/db/schema";

export type UserRole = User["role"];
export type Permission =
  | "gameplay.access"
  | "player.create"
  | "admin.access_panel"
  | "admin.manage_seasons";

const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  user: ["gameplay.access", "player.create"],
  admin: ["admin.access_panel", "admin.manage_seasons"],
};

function isUserRole(value: string): value is UserRole {
  return value === "user" || value === "admin";
}

export function hasPermission(role: string | undefined, permission: Permission): boolean {
  if (!role || !isUserRole(role)) {
    return false;
  }

  return ROLE_PERMISSIONS[role].includes(permission);
}

export function requirePermission(permission: Permission) {
  return async function guardByPermission(request: FastifyRequest, reply: FastifyReply) {
    const userRole = request.authSession?.user.role;

    if (!hasPermission(userRole, permission)) {
      return reply.status(403).send({ error: "Forbidden" });
    }
  };
}

export function canAccessGameplay(role: string | undefined): boolean {
  return hasPermission(role, "gameplay.access");
}

export function canCreatePlayer(role: string | undefined): boolean {
  return hasPermission(role, "player.create");
}
