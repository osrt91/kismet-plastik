"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { forgotPasswordSchema } from "@/lib/validations/auth";

interface ForgotPasswordResult {
  success: boolean;
  error?: string;
}

export async function forgotPasswordAction(formData: FormData): Promise<ForgotPasswordResult> {
  const raw = { email: formData.get("email") as string };

  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError || "Geçersiz e-posta adresi." };
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Cannot set cookies in certain contexts
          }
        },
      },
    }
  );

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? "https://www.kismetplastik.com" : "http://localhost:3000"}/auth/callback?type=recovery`,
  });

  if (error) {
    return { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." };
  }

  return { success: true };
}
