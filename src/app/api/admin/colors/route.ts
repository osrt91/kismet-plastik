import { NextRequest, NextResponse } from "next/server";
import { checkAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { rateLimit } from "@/lib/rate-limit";

interface ColorPayload {
  target_type: "product" | "accessory";
  target_id: string;
  color_name_tr: string;
  color_name_en?: string;
  color_name_ar?: string;
  color_hex: string;
  opacity?: number;
  metallic?: number;
  is_default?: boolean;
  sort_order?: number;
}

function validate(data: ColorPayload): string | null {
  if (!data.target_type || !["product", "accessory"].includes(data.target_type)) {
    return "target_type must be 'product' or 'accessory'";
  }
  if (!data.target_id?.trim()) return "target_id is required";
  if (!data.color_name_tr?.trim()) return "color_name_tr is required";
  if (!data.color_hex?.trim()) return "color_hex is required";
  if (!/^#[0-9a-fA-F]{6}$/.test(data.color_hex)) {
    return "color_hex must be a valid hex color (e.g. #FF0000)";
  }
  if (data.opacity !== undefined && (data.opacity < 0 || data.opacity > 1)) {
    return "opacity must be between 0 and 1";
  }
  if (data.metallic !== undefined && (data.metallic < 0 || data.metallic > 1)) {
    return "metallic must be between 0 and 1";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { ok: allowed } = rateLimit(`admin-colors:${ip}`, {
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
    const body = (await request.json()) as ColorPayload;
    const error = validate(body);
    if (error) {
      return NextResponse.json({ success: false, error }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data, error: dbError } = await supabase
      .from("color_options")
      .insert({
        target_type: body.target_type,
        target_id: body.target_id,
        color_name_tr: body.color_name_tr,
        color_name_en: body.color_name_en || null,
        color_name_ar: body.color_name_ar || null,
        color_hex: body.color_hex,
        opacity: body.opacity ?? 1.0,
        metallic: body.metallic ?? 0.0,
        is_default: body.is_default ?? false,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (dbError) {
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
