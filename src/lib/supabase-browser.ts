import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Returns a singleton browser-side Supabase client with SSR cookie support.
 * Use this in Client Components ("use client") for authenticated operations.
 * Automatically manages session cookies for Supabase Auth.
 * @returns Browser Supabase client instance
 */
export function getSupabaseBrowser() {
  if (client) return client;

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
