import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

interface DownloadRequest {
  name: string;
  email: string;
  company?: string;
  resourceId: string;
}

function validateInput(data: DownloadRequest): string | null {
  if (!data.name?.trim()) return "Ad Soyad alanı zorunludur.";
  if (data.name.trim().length < 2) return "Ad Soyad en az 2 karakter olmalıdır.";
  if (!data.email?.trim()) return "E-posta alanı zorunludur.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "Geçerli bir e-posta adresi giriniz.";
  if (!data.resourceId?.trim()) return "Kaynak seçimi zorunludur.";
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { ok: allowed } = rateLimit(`resource-download:${ip}`, {
      limit: 5,
      windowMs: 60_000,
    });

    if (!allowed) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.",
        },
        { status: 429 }
      );
    }

    const body = (await request.json()) as DownloadRequest;
    const inputError = validateInput(body);

    if (inputError) {
      return NextResponse.json({ success: false, error: inputError }, { status: 400 });
    }

    const supabase = getSupabase();

    // Look up the resource in DB
    const { data: resource } = await supabase
      .from("resources")
      .select("id, file_url, title_tr")
      .eq("id", body.resourceId)
      .eq("is_active", true)
      .single();

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Geçersiz kaynak seçimi." },
        { status: 400 }
      );
    }

    // Insert lead download record (non-blocking — don't fail if insert errors)
    void (async () => {
      try {
        await supabase
          .from("lead_downloads")
          .insert({
            resource_id: resource.id,
            contact_name: body.name.trim(),
            email: body.email.trim(),
            company_name: body.company?.trim() || "",
          });
      } catch {
        // Best-effort — ignore errors
      }
    })();

    return NextResponse.json({
      success: true,
      message: "İndirme bağlantınız hazır.",
      downloadUrl: resource.file_url,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
}
