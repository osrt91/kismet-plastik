import { NextRequest, NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;

  if (!productId) {
    return NextResponse.json(
      { success: false, error: "Product ID is required" },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { success: true, accessories: [], bodyColors: [] },
      { status: 200 }
    );
  }

  try {
    const supabase = getSupabase();

    // Get compatible accessories with their types
    const { data: accessories, error: accError } = await supabase
      .from("product_accessories")
      .select(
        `
        id,
        product_id,
        accessory_type_id,
        is_default,
        sort_order,
        accessory_type:accessory_types (
          id,
          name_tr,
          name_en,
          name_ar,
          slug,
          category,
          neck_finish,
          thumbnail_url
        )
      `
      )
      .eq("product_id", productId)
      .order("sort_order");

    if (accError) {
      console.error("[Configurator API] Accessories error:", accError);
    }

    // Get body color options for this product
    const { data: bodyColors, error: colorError } = await supabase
      .from("color_options")
      .select("*")
      .eq("target_type", "product")
      .eq("target_id", productId)
      .order("sort_order");

    if (colorError) {
      console.error("[Configurator API] Colors error:", colorError);
    }

    return NextResponse.json({
      success: true,
      accessories: accessories || [],
      bodyColors: bodyColors || [],
    });
  } catch (error) {
    console.error("[Configurator API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
