import { NextRequest, NextResponse } from "next/server";

/**
 * Timing-safe string comparison to prevent timing attacks.
 * Compares two strings in constant time regardless of where they differ.
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns true if strings are identical, false otherwise
 */
export function timingSafeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Checks admin authentication by verifying the admin-token cookie.
 * Uses timing-safe comparison against ADMIN_SECRET env variable.
 * @param request - The incoming Next.js request
 * @returns null if authenticated, or a 401 JSON response if unauthorized
 */
export function checkAuth(request: NextRequest): NextResponse | null {
  const token = request.cookies.get("admin-token")?.value;
  const secret = process.env.ADMIN_SECRET;
  if (!token || !secret || !timingSafeCompare(token, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

/**
 * Sanitizes user search input by removing SQL-unsafe characters.
 * Strips: % _ \ ' " ( )
 * @param input - Raw user search input
 * @returns Sanitized string safe for use in database queries
 */
export function sanitizeSearchInput(input: string): string {
  return input.replace(/[%_\\'"()]/g, "");
}
