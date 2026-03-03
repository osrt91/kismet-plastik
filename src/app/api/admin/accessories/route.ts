import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

interface AccessoryPayload {
  product_id: string;
  accessory_type_id: string;
  is_default?: boolean;
  sort_order?: number;
}

function validate(data: AccessoryPayload): string | null {
  if (!data.product_id?.trim()) return "product_id is required";
  if (!data.accessory_type_id?.trim()) return "accessory_type_id is required";
  return null;
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin-accessories:${ip}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests" },
      { status: 429 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const body = (await request.json()) as AccessoryPayload;
    const error = validate(body);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error: dbError } = await supabase
      .from("product_accessories")
      .insert({
        product_id: body.product_id,
        accessory_type_id: body.accessory_type_id,
        is_default: body.is_default ?? false,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (dbError) {
      if (dbError.code === "23505") {
        return NextResponse.json(
          { success: false, error: "This accessory is already linked to this product" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { success: false, error: dbError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
