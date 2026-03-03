import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { checkAuth } from "@/lib/auth";

/**
 * GET /api/orders/[id] — Retrieves a single order with items, status history, and profile.
 * Requires admin authentication.
 * @returns { success, data } on success, 404 if not found
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*), order_status_history(*), profiles(full_name, company_name, email, phone)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Sipariş bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}

/**
 * PATCH /api/orders/[id] — Updates order status, tracking, payment, or admin notes.
 * Records status changes in order_status_history for audit trail.
 * Requires admin authentication.
 * @returns { success, data } on success
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = checkAuth(request);
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, tracking_number, admin_notes, payment_status } = body;

    const supabase = getSupabase();

    const { data: currentOrder } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    const updates: Record<string, unknown> = {};
    if (status) updates.status = status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    if (admin_notes !== undefined) updates.admin_notes = admin_notes;
    if (payment_status) updates.payment_status = payment_status;

    const { data, error } = await supabase
      .from("orders")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ success: false, error: "Güncelleme başarısız." }, { status: 500 });
    }

    if (status && currentOrder?.status !== status) {
      await supabase.from("order_status_history").insert({
        order_id: id,
        old_status: currentOrder?.status,
        new_status: status,
        note: admin_notes || null,
      });
    }

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Bir hata oluştu." }, { status: 500 });
  }
}
