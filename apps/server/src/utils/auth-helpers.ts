import { createAuth } from "@interviews-tool/auth";

/**
 * Authentication Helper Utilities
 *
 * Provides consistent authentication patterns for route handlers
 */

/**
 * Extracts the authenticated user from a request
 *
 * @param request - The incoming HTTP request
 * @returns The user object with id, or null if not authenticated
 *
 * @example
 * ```typescript
 * const user = await getUserFromRequest(request);
 * if (!user) {
 *   throw new UnauthorizedError();
 * }
 * ```
 */
export async function getUserFromRequest(request: Request): Promise<{ id: string } | null> {
  const auth = createAuth(process.env.CORS_ORIGIN || "");
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return null;
  }
  return { id: session.user.id };
}
