import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin, requireSupabase } from "@/lib/supabase-admin";
import { checkAuth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Geçersiz JSON" }, { status: 400 });
  }

  const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const { term_tr, term_en, definition_tr, definition_en, letter, display_order, is_active } = body as {
    term_tr?: string; term_en?: string; definition_tr?: string; definition_en?: string;
    letter?: string; display_order?: number; is_active?: boolean;
  };

  if (term_tr !== undefined) updatePayload.term_tr = term_tr;
  if (term_en !== undefined) updatePayload.term_en = term_en;
  if (definition_tr !== undefined) updatePayload.definition_tr = definition_tr;
  if (definition_en !== undefined) updatePayload.definition_en = definition_en;
  if (letter !== undefined) updatePayload.letter = letter.toUpperCase();
  if (display_order !== undefined) updatePayload.display_order = display_order;
  if (is_active !== undefined) updatePayload.is_active = is_active;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("glossary_terms")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[Admin Glossary PUT]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  const sbError = requireSupabase();
  if (sbError) return sbError;

  const { id } = await params;

  try {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from("glossary_terms").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Admin Glossary DELETE]", err);
    return NextResponse.json({ success: false, error: "Sunucu hatası" }, { status: 500 });
  }
}
