import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { timingSafeCompare } from "@/lib/auth";

export const locales = ["tr", "en"] as const;
export const defaultLocale = "tr";

function getLocaleFromPath(pathname: string): string {
  const locale = locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  return locale || defaultLocale;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes — cookie-based auth (separate from Supabase)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return;
    const token = request.cookies.get("admin-token")?.value;
    const secret = process.env.ADMIN_SECRET;
    if (!token || !secret || !timingSafeCompare(token, secret)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return;
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // Check if route requires auth (bayi-panel = portal)
    const isPortalRoute = locales.some(
      (locale) => pathname.startsWith(`/${locale}/bayi-panel`)
    );

    if (isPortalRoute) {
      const locale = getLocaleFromPath(pathname);

      // Create Supabase client for middleware with cookie handling
      let response = NextResponse.next({
        request: { headers: request.headers },
      });

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value);
              });
              response = NextResponse.next({
                request: { headers: request.headers },
              });
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      // Use getUser() — validates JWT with Supabase Auth server
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/bayi-girisi`;
        return NextResponse.redirect(url);
      }

      // Check approval status
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_approved, role")
        .eq("id", user.id)
        .single();

      if (profile && !profile.is_approved && profile.role === "dealer") {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/bayi-girisi`;
        url.searchParams.set("pending", "true");
        return NextResponse.redirect(url);
      }

      return response;
    }

    // Non-protected locale routes — refresh session if cookies exist
    const hasAuthCookie = Array.from(request.cookies.getAll()).some(
      (c) =>
        c.name.startsWith("sb-") &&
        (c.name.endsWith("-auth-token") ||
          c.name === "sb-access-token" ||
          c.name === "sb-refresh-token")
    );

    if (hasAuthCookie) {
      let response = NextResponse.next({
        request: { headers: request.headers },
      });

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value);
              });
              response = NextResponse.next({
                request: { headers: request.headers },
              });
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        }
      );

      // Refresh session silently
      await supabase.auth.getUser();
      return response;
    }

    return;
  }

  // No locale in path — redirect to default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon\\.ico|images|fonts|sertifikalar|manifest\\.json|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
