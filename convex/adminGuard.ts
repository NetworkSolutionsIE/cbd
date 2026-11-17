/**
 * Shared secret guard for admin-only Convex functions.
 *
 * The public website (including the static build) can call `create` mutations,
 * but reading / updating / deleting submissions and orders requires the
 * ADMIN_API_KEY that only the Next.js server holds.
 */
export function assertAdminKey(provided: string): void {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || provided !== expected) {
    throw new Error("Unauthorized");
  }
}
