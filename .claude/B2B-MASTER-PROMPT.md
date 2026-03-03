# KİSMETPLASTİK B2B DÖNÜŞÜM — MASTER PROMPT

Sen bu projenin orchestrator'ısın. Aşağıdaki görev paketini analiz et, specialist agent'lara delege et ve paralel çalıştır. Hiçbir adımı atlama — sıralamayı koru ama bağımsız görevleri eş zamanlı çalıştır.

## PROJE BAĞLAMI

- **Site:** kismetplastik.vercel.app
- **Repo:** github.com/osrt91/kismetplastik (branch: master)
- **Stack:** Next.js 16 (App Router, Turbopack), Tailwind CSS 4, Supabase, TypeScript, React 19
- **Mevcut durum:** B2C bilgi sitesi — ürün gösterimi var ama satış yok
- **Hedef:** Tam entegre B2B platform + 2D/3D ürün görselleştirme + sipariş sistemi
- **CLAUDE.md:** Repo root'ta — tüm kurallar orada. Her agent CLAUDE.md'yi okumalı.

## TAMAMLANAN FAZLAR

### ~~FAZ 7 — TASARIM SİSTEMİ~~ ✅ TAMAMLANDI
- globals.css: @theme bloğunda brand token'lar (navy/amber/cream)
- layout.tsx: Fraunces + Instrument Sans fontları (next/font/google)
- button.tsx, badge.tsx, input.tsx, select.tsx, textarea.tsx: brand renklere güncellendi
- Card.tsx (3 variant: default/elevated/interactive) oluşturuldu
- StatusBadge.tsx (sipariş durumları renk mapping) oluşturuldu
- Build başarılı, push yapıldı

## MEVCUT ROUTE YAPISI (83 sayfa, build geçiyor)

```
app/
├── [locale]/                    # TR/EN i18n
│   ├── page.tsx                 # Ana sayfa
│   ├── urunler/                 # Ürün katalogu
│   ├── bayi-girisi/             # Bayi login
│   ├── bayi-kayit/              # Bayi kayıt (placeholder)
│   ├── bayi-panel/              # B2B panel
│   │   ├── profilim/            # Profil (placeholder)
│   │   ├── siparislerim/        # Siparişler (placeholder)
│   │   ├── tekliflerim/         # Teklifler (placeholder)
│   │   └── urunler/             # Ürünler (placeholder)
│   ├── hakkimizda/, iletisim/, kalite/, kariyer/
│   ├── katalog/, sss/, uretim/, teklif-al/
│   ├── blog/, galeri/, kvkk/
│   ├── ambalaj-sozlugu/, arge/, fuarlar/
│   ├── numune-talep/, referanslar/, sektorler/
│   ├── surdurulebilirlik/, vizyon-misyon/, urun-olustur/
│   └── error.tsx, not-found.tsx, loading.tsx
├── admin/                       # Admin panel
│   ├── blog/, products/, content/, dealers/, gallery/
│   └── login/
├── api/                         # Route Handlers
│   ├── admin/ (auth, blog, content, dealers, products)
│   ├── auth/ (login, register)
│   ├── chat/, contact/, gallery/, orders/, quote/, quotes/
│   └── qr/
├── globals.css                  # Brand token'lar ✅
├── layout.tsx                   # Root layout
├── robots.ts, sitemap.ts
```

---

## FAZ 1 — KRİTİK SORUN TESPİTİ (Paralel Çalıştır)

### 1A — Tasarım Audit (architect + frontend-developer)

**architect görevi:**
- app/ klasör yapısını incele. Route organization'ı değerlendir.
- Gereksiz "use client" direktifleri var mı?
- Server Component vs Client Component dağılımı doğru mu?
- Mevcut `[locale]` yapısı ile planlanan `(public)/(portal)/(admin)` yapısı nasıl entegre edilecek?
- Çıktı: Mimari sorun raporu + refactor önerileri

**frontend-developer görevi:**
- Tüm component dosyalarını tara (components/, app/)
- Şu tasarım sorunlarını tespit et:
  - Inter / Roboto / system-ui font kullanımı → Fraunces + Instrument Sans olmalı
  - Purple gradient kullanımı → Kaldır
  - Generic bg-white + text-gray palette → Navy/Amber/Cream kullan
  - Hover state'siz button'lar → Micro-interaction ekle
  - Brand token'ları (globals.css'teki) kullanmayan componentler
- ÖNEMLİ: Faz 7'de güncellenen componentleri (button, badge, input, select, textarea, Card, StatusBadge) tekrar değiştirme
- Çıktı: Her sorunlu component için düzeltme + uygulanmış kod

### 1B — Güvenlik & DB Audit (security-agent + supabase-agent)

**security-agent görevi:**
- .env.local / .env dosyalarını tara — NEXT_PUBLIC_ prefix'li hassas key var mı?
- Mevcut RLS policy'leri kontrol et
- Route Handler'larda auth kontrolü eksik mi?
- Çıktı: Güvenlik raporu (kritik / yüksek / orta)

**supabase-agent görevi:**
- Mevcut Supabase schema'yı analiz et (supabase/migrations/ klasörü)
- B2B sistem için gereken tablo yapısını tasarla (Faz 3'te detay var)
- Çıktı: Schema diagram + migration planı

---

## FAZ 2 — MİMARİ REFACTOR (architect)

Mevcut `[locale]` yapısını koruyarak, route group'ları ekle:

```
app/
  [locale]/
    (public)/                    # Auth gerektirmeyen (mevcut sayfaların çoğu buraya taşınır)
      page.tsx                   # Ana sayfa
      urunler/                   # Ürün katalogu
      urunler/[category]/[slug]/ # Ürün detay — 3D viewer
      visualizer/                # 2D/3D tasarım aracı (standalone)

    (portal)/                    # B2B portal — auth zorunlu
      layout.tsx                 # Portal layout (sidebar nav)
      dashboard/                 # B2B müşteri dashboardı
      siparisler/                # Sipariş yönetimi
        page.tsx                 # Sipariş listesi
        [id]/                    # Sipariş detay
        new/                     # Yeni sipariş
      teklifler/                 # Teklif istekleri
      favoriler/                 # Kayıtlı ürünler
      tasarimlarim/              # Kaydedilmiş 2D/3D tasarımlar
      profil/                    # Firma profili

    (admin)/                     # Admin panel — role: admin
      dashboard/
      musteriler/
      siparisler/
      urunler/                   # Ürün yönetimi

  auth/
    login/
    register/                    # Kurumsal kayıt formu
    callback/                    # Supabase OAuth callback
```

**Dikkat:** Mevcut çalışan sayfaları bozmadan taşı. Her taşıma sonrası `npm run build` ile kontrol et. loading.tsx, error.tsx ve gerekiyorsa not-found.tsx oluştur.

---

## FAZ 3 — VERİTABANI (supabase-agent)

Şu tabloları migration dosyaları olarak oluştur (supabase/migrations/):

### Tablolar

**companies** (B2B firma profilleri)
- id, name, tax_number (unique), sector, address, city, country
- phone, email, website, logo_url, credit_limit, discount_rate
- payment_terms (enum: prepaid/net15/net30/net60)
- status (enum: pending/active/suspended)
- created_at, updated_at

**profiles** (kullanıcı profilleri — auth.users'a bağlı)
- id (= auth.users.id), company_id (FK), full_name
- role (enum: admin/company_admin/buyer)
- phone, avatar_url, is_active
- created_at, updated_at

**products** (ürün katalogu)
- id, sku (unique), name_tr, name_en, slug (unique)
- category (enum: pet_sise/plastik_sise/kapak/tipa/sprey/diger)
- subcategory, volume_ml, material, neck_size_mm
- color_options (jsonb), has_3d_model (boolean)
- model_3d_url, model_2d_url, thumbnail_url, images (jsonb array)
- base_price, moq (minimum order quantity), weight_gram
- dimensions (jsonb: {width, height, depth})
- is_active, is_featured, created_at, updated_at

**price_tiers** (hacim bazlı fiyatlandırma)
- id, product_id (FK), company_id (FK nullable — null = genel)
- min_quantity, max_quantity, unit_price, currency

**orders** (siparişler)
- id, order_number (unique, auto-generate), company_id (FK)
- created_by (FK profiles)
- status (enum: draft/pending/confirmed/production/shipped/delivered/cancelled)
- total_amount, currency, payment_status, payment_terms
- shipping_address (jsonb), notes, estimated_delivery
- created_at, updated_at

**order_items** (sipariş kalemleri)
- id, order_id (FK), product_id (FK), quantity
- unit_price, custom_color, custom_label_url
- design_config (jsonb — 2D/3D tasarım verisi), subtotal

**quote_requests** (teklif istekleri)
- id, company_id (FK nullable), contact_name, contact_email
- contact_phone, company_name, product_requests (jsonb)
- notes, status (enum: new/reviewing/sent/accepted/rejected)
- assigned_to (FK profiles nullable), created_at

**saved_designs** (2D/3D tasarımlar)
- id, user_id (FK profiles), product_id (FK), name
- design_data (jsonb — renk, etiket, logo pozisyonu)
- preview_url, is_public, created_at, updated_at

### Her tablo için ZORUNLU:
- `CREATE EXTENSION IF NOT EXISTS moddatetime;` (ilk migration'da)
- RLS'i aktif et
- Uygun policy'leri yaz (admin hepsini görür, company_admin kendi firmasını, buyer sadece kendi)
- Index'leri ekle (FK'lar, slug'lar, order_number)
- updated_at trigger'ı ekle (moddatetime)

---

## FAZ 4 — AUTH SİSTEMİ (auth-agent)

1. **Middleware** (middleware.ts):
   - /[locale]/(portal)/* → auth zorunlu, redirect /auth/login
   - /[locale]/(admin)/* → auth + role: admin zorunlu
   - Session refresh her request'te
   - `getUser()` kullan, `getSession()` değil

2. **Kayıt akışı** (app/auth/register/):
   - Kurumsal kayıt formu: firma adı, vergi no, sektör, yetkili bilgileri
   - Email doğrulama
   - Kayıt sonrası status: "pending" → admin onayı bekliyor

3. **Login** (app/auth/login/):
   - Email/password
   - "Hesabınız onay bekliyor" mesajı (pending status için)
   - Şifremi unuttum flow

4. **Session yönetimi:**
   - lib/supabase/server.ts — Server Component helper (mevcut, kontrol et)
   - lib/supabase/client.ts — Client Component helper (mevcut, kontrol et)
   - lib/auth/getUser.ts — type-safe user getter

---

## FAZ 5 — B2B PORTAL (frontend-developer + api-agent)

### 5A — Dashboard (app/[locale]/(portal)/dashboard/page.tsx)
Server Component. Gösterecekleri:
- Aktif sipariş sayısı + toplam hacim (bu ay)
- Bekleyen teklif istekleri
- Son 5 sipariş (StatusBadge ile)
- Hızlı sipariş butonu
- Öne çıkan / sık sipariş edilen ürünler
- Tasarım: Lacivert sidebar (#0A1628), cream içerik alanı, amber accent. Fraunces başlıklar.

### 5B — Ürün Katalogu (app/[locale]/(public)/urunler/)
- Filtreleme: kategori, hacim, malzeme, boyun çapı
- Grid/liste görünüm toggle
- Her kart: thumbnail, SKU, base fiyat (login yoksa "Fiyat için kayıt olun")
- Login varsa: firma indirimini uygula
- "3D İncele" butonu — modeli olan ürünlerde

### 5C — Sipariş Oluşturma (app/[locale]/(portal)/siparisler/new/)
Multi-step form (Server Actions):
1. Ürün seçimi + miktar (fiyat tierleri anlık hesaplansın)
2. Özelleştirme (renk seçimi, etiket upload, 2D preview)
3. Teslimat adresi + termin
4. Özet + onay

### 5D — Server Actions (app/actions/)
- createOrder(formData) — sipariş oluştur
- updateOrderStatus(orderId, status) — admin only
- createQuoteRequest(formData) — teklif iste
- saveDesign(designData) — 2D/3D tasarım kaydet
- calculatePrice(productId, quantity, companyId) — tier fiyat hesapla

Her action'da: auth kontrolü + Zod validation + proper error handling

---

## FAZ 6 — 2D/3D VİZÜALİZASYON ARACI (frontend-developer)

Bu projenin en önemli differentiator'ı.

### Dosya: app/[locale]/(public)/visualizer/page.tsx
### Component: components/features/ProductVisualizer/

**2D Editör:**
- Canvas API veya react-konva
- Ürün şablonu (SVG silhouette) üzerine: renk seçici, logo/etiket upload, drag-drop pozisyon, yazı ekleme
- Export: PNG preview

**3D Viewer:**
- Three.js (@react-three/fiber + @react-three/drei)
- Dynamic import (sadece visualizer'da yüklensin — bundle size!)
- GLB model yükle (Supabase Storage'dan)
- Model yoksa: basit procedural geometri (silindir + kapak)
- Kontroller: orbit, zoom
- Renk real-time material change
- Export: screenshot

**UI yapısı:**
```
┌─────────────────┬────────────────────────────┐
│  Ürün Seçici    │                            │
│  (sol panel)    │   3D Viewport / 2D Canvas  │
│                 │   (merkez - büyük)         │
│  Renk Paleti    │                            │
│  Logo Upload    ├────────────────────────────┤
│  Yazı Ekle      │   Tasarım Kaydet           │
│  Ölçüler        │   PNG Export               │
│                 │   Sipariş Ver              │
└─────────────────┴────────────────────────────┘
```

**Tasarım:** Koyu tema (#0D0D0D background). İnce kenarlıklı araç paneli. Viewport'ta subtle grid. Amber CTA butonlar. Profesyonel CAD hissi.

---

## FAZ 8 — GÜVENLİK & PERFORMANS (security-agent + api-agent)

**security-agent:**
- Tüm Server Action'lara Zod validation ekle
- Rate limiting: /auth/* ve /api/* route'larına
- CSP header'ları: next.config.ts'e ekle
- File upload güvenliği: tip kontrolü, boyut limiti (10MB max)
- Supabase Storage bucket policy: authenticated only

**api-agent:**
- next.config.ts'e security headers ekle
- Image domain whitelist: Supabase Storage URL
- Bundle analyzer çalıştır, ağır import'ları tespit et
- Three.js için dynamic import kontrolü

---

## FAZ 9 — TEST (test-agent)

1. **Unit tests** (Vitest):
   - calculatePrice() — tüm tier senaryoları
   - createOrder() action — başarı, validation hatası, auth hatası
   - Auth middleware — korumalı route redirect kontrolü

2. **Component tests** (React Testing Library):
   - ProductCard — fiyat gösterimi (login/logout durumu)
   - StatusBadge — tüm status'lar için renk

3. **E2E tests** (Playwright):
   - Tam B2B kayıt akışı (register → pending message)
   - Login → dashboard görünüm
   - Ürün seçimi → sipariş oluşturma flow'u

---

## FAZ 10 — DOKÜMANTASYON (docs-agent)

1. README.md güncelle — yeni B2B özellikler, kurulum adımları
2. ARCHITECTURE.md oluştur — route yapısı, veri akışı, agent sorumlulukları
3. docs/B2B_PORTAL.md — portal kullanım kılavuzu
4. docs/VISUALIZER.md — 2D/3D araç teknik dokümantasyonu
5. docs/DATABASE_SCHEMA.md — tablo ilişkileri + RLS açıklamaları
6. Kritik API'lar için JSDoc yorumları

---

## TAMAMLANMA KRİTERLERİ

Her faz sonunda kontrol et:

- [ ] TypeScript hata yok (`npm run build` başarılı)
- [ ] ESLint hata yok
- [ ] RLS tüm tablolarda aktif
- [ ] Auth kontrolü tüm portal route'larında var
- [ ] 3D visualizer mobilde de çalışıyor (fallback 2D)
- [ ] Tüm formlar Zod ile validate ediliyor
- [ ] Tasarımda Inter/Roboto/system-font yok
- [ ] Generic purple gradient yok
- [ ] Brand renkleri: Navy (#0A1628) + Amber (#F59E0B) + Cream (#FAFAF7)
- [ ] Fontlar: Fraunces (display) + Instrument Sans (body)
- [ ] Build başarılı (hata yok)

---

## BAŞLA

Faz 1A ve 1B'yi paralel başlat. Her faz tamamlandığında bir sonrakine geç. Kritik sorunlar bulursan ilgili agent'a hemen ilet.
