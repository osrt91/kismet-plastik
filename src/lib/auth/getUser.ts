import "server-only";
import { supabaseServer } from "@/lib/supabase/server";
import type { DbProfile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

export interface AuthUser {
  user: User;
  profile: DbProfile;
}

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await supabaseServer();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { user, profile: profile as DbProfile };
}
