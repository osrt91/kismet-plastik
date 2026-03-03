"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { registerSchema } from "@/lib/validations/auth";

interface RegisterResult {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const raw = {
    company_name: formData.get("company_name") as string,
    tax_number: formData.get("tax_number") as string,
    tax_office: (formData.get("tax_office") as string) || undefined,
    sector: (formData.get("sector") as string) || undefined,
    full_name: formData.get("full_name") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    city: (formData.get("city") as string) || undefined,
    district: (formData.get("district") as string) || undefined,
    company_address: (formData.get("company_address") as string) || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

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
            // Cannot set cookies in Server Action response body
          }
        },
      },
    }
  );

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: { full_name: data.full_name },
    },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return { success: false, error: "Bu e-posta adresi zaten kayıtlı." };
    }
    return { success: false, error: authError.message };
  }

  if (authData.user) {
    // The DB trigger handle_new_user() creates the profile row automatically.
    // We update it with company fields and set role to dealer.
    await supabase
      .from("profiles")
      .update({
        full_name: data.full_name,
        phone: data.phone,
        company_name: data.company_name,
        tax_number: data.tax_number,
        tax_office: data.tax_office || null,
        company_address: data.company_address || null,
        city: data.city || null,
        district: data.district || null,
        role: "dealer",
        is_approved: false,
      })
      .eq("id", authData.user.id);
  }

  return { success: true };
}
