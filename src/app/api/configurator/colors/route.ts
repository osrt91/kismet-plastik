import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("target_type");
  const targetId = searchParams.get("target_id");

  if (!targetType || !targetId) {
    return NextResponse.json(
      { success: false, error: "target_type and target_id are required" },
      { status: 400 }
    );
  }

  if (targetType !== "product" && targetType !== "accessory") {
    return NextResponse.json(
      { success: false, error: "target_type must be 'product' or 'accessory'" },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ success: true, colors: [] }, { status: 200 });
  }

  try {
    const supabase = getSupabase();

    const { data: colors, error } = await supabase
      .from("color_options")
      .select("*")
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .order("sort_order");

    if (error) {
      console.error("[Colors API] Error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch colors" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, colors: colors || [] });
  } catch (error) {
    console.error("[Colors API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
