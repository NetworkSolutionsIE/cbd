/**
 * Secret passed to admin-only Convex functions.
 * Server-side only: this is NOT a NEXT_PUBLIC_ variable, so it is never sent to browsers.
 */
export const adminKey = (): string => process.env.ADMIN_API_KEY ?? "";

