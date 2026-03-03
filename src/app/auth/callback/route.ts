import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (code) {
    const response = NextResponse.redirect(`${origin}/tr/bayi-panel`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // For password recovery, redirect to a page where user can set new password
      if (type === "recovery") {
        const recoveryUrl = new URL(`${origin}/tr/bayi-panel/profilim`);
        recoveryUrl.searchParams.set("reset", "true");
        return NextResponse.redirect(recoveryUrl, { headers: response.headers });
      }

      return response;
    }
  }

  // Fallback redirect to login on error
  return NextResponse.redirect(`${origin}/tr/bayi-girisi`);
}
