import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("glossary_terms")
      .select("*")
      .order("letter")
      .order("display_order");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: data ?? [] });
  } catch (err) {
    console.error("[Admin Glossary GET]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const { term_tr, term_en, definition_tr, definition_en, letter, display_order, is_active } = body as {
    term_tr?: string; term_en?: string; definition_tr?: string; definition_en?: string;
    letter?: string; display_order?: number; is_active?: boolean;
  };

  if (!term_tr?.trim() || !definition_tr?.trim() || !letter?.trim()) {
    return NextResponse.json({ success: false, error: "term_tr, definition_tr ve letter zorunludur" }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("glossary_terms")
      .insert({
        term_tr: term_tr.trim(),
        term_en: (term_en ?? "").trim(),
        definition_tr: definition_tr.trim(),
        definition_en: (definition_en ?? "").trim(),
        letter: letter.trim().toUpperCase(),
        display_order: display_order ?? 0,
        is_active: is_active ?? true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (err) {
    console.error("[Admin Glossary POST]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
