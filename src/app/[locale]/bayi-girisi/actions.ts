"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, forgotPasswordSchema } from "@/lib/validations/auth";

interface LoginResult {
  success: boolean;
  error?: string;
  pending?: boolean;
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return { success: false, error: firstError || "Geçersiz giriş bilgileri." };
  }

  const { email, password } = parsed.data;

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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: "E-posta veya şifre hatalı." };
  }

  // Check approval status
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_approved")
    .eq("id", data.user.id)
    .single();

  if (profile && !profile.is_approved && profile.role === "dealer") {
    // Sign out the user since they're not approved yet
    await supabase.auth.signOut();
    return {
      success: false,
      pending: true,
      error: "Bayilik başvurunuz henüz onaylanmadı. Onay işlemi tamamlandığında size e-posta ile bilgi verilecektir.",
    };
  }

  return { success: true };
}

export async function redirectToDashboard(locale: string) {
  redirect(`/${locale}/bayi-panel`);
}

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
