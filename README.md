# Kısmet Plastik — B2B Kozmetik Ambalaj Platformu

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e)](https://supabase.com)

**Kısmet Plastik**, kozmetik ambalaj sektöründe faaliyet gösteren bir B2B platformdur. Bayiler ürün kataloğunu inceleyebilir, sipariş oluşturabilir, teklif talep edebilir ve 3D ürün görselleştirici ile ambalajları özelleştirebilir.

**Canlı URL:** [https://www.kismetplastik.com](https://www.kismetplastik.com)

---

## Özellikler

### Herkese Açık (Public)
- Çift dilli arayüz (Türkçe / İngilizce)
- 8 kategoride ürün kataloğu (PET şişe, plastik şişe, kapak, tıpa, sprey, pompa, tetikli püskürtücü, huni)
- Gelişmiş ürün filtreleme (malzeme, hacim, boyun çapı, renk, şekil)
- 3D ürün görselleştirici (Three.js / React Three Fiber)
- Blog, galeri, SSS, kurumsal sayfalar
- İletişim ve teklif talep formları (Resend e-posta entegrasyonu)
- PWA desteği + Android TWA (Google Play Store)
- SEO optimizasyonu (JSON-LD, sitemap, robots.txt)

### Bayi Portalı (B2B)
- Kurumsal kayıt ve admin onay sistemi
- Bayi dashboard (aktif siparişler, bekleyen teklifler, istatistikler)
- Sipariş oluşturma ve takip
- Teklif talep yönetimi
- Profil ve firma bilgileri yönetimi

### Admin Paneli
- Ürün CRUD (ekleme, düzenleme, silme)
- Blog yönetimi
- Galeri yönetimi (görsel yükleme, sıralama)
- Bayi onay sistemi
- Sipariş ve teklif yönetimi

---

## Tech Stack

| Katman | Teknoloji |
|--------|-----------|
| Framework | Next.js 16.1.6 (App Router, React 19, Turbopack) |
| Dil | TypeScript 5 (strict mode) |
| Stil | Tailwind CSS 4, CSS custom properties |
| Bileşenler | shadcn/ui (new-york style, Radix UI) |
| Veritabanı | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (bayi/müşteri) + Cookie-based (admin) |
| E-posta | Resend |
| 3D | Three.js / React Three Fiber + Drei |
| Animasyon | Framer Motion, CSS scroll-driven animations |
| İkonlar | Lucide React, Phosphor Icons, React Icons |
| Deployment | Vercel (fra1) + Android TWA |

---

## Kurulum

### Gereksinimler

- Node.js 18+
- npm 9+
- Supabase hesabı (ücretsiz plan yeterli)

### 1. Repo'yu klonla

```bash
git clone https://github.com/osrt91/kismetplastik.git
cd kismetplastik
```

### 2. Bağımlılıkları yükle

```bash
npm install
```

### 3. Ortam değişkenlerini yapılandır

`.env.example` dosyasını `.env.local` olarak kopyala ve değerleri doldur:

```bash
cp .env.example .env.local
```

### 4. Supabase kurulumu

1. [Supabase Dashboard](https://supabase.com/dashboard) üzerinden yeni bir proje oluştur
2. SQL Editor'a git ve aşağıdaki dosyaları sırasıyla çalıştır:
   - `docs/supabase-schema.sql` — Temel tablolar (categories, products, blog_posts)
   - `docs/supabase-migration-002.sql` — B2B portal (profiles, orders, quotes)
   - `docs/supabase-migration-003.sql` — Galeri sistemi
3. Project Settings > API bölümünden URL ve anon key değerlerini `.env.local`'e ekle

### 5. Geliştirme sunucusunu başlat

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

---

## Ortam Değişkenleri

| Değişken | Zorunlu | Açıklama |
|----------|---------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Evet | Supabase proje URL'i |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Evet | Supabase anonim anahtar |
| `ADMIN_SECRET` | Evet | Admin panel şifresi (min 32 karakter) |
| `RESEND_API_KEY` | Hayır | Resend e-posta API anahtarı |
| `EMAIL_FROM` | Hayır | Gönderen e-posta adresi |
| `EMAIL_TO` | Hayır | Alıcı e-posta (varsayılan: bilgi@kismetplastik.com) |
| `OPENAI_API_KEY` | Hayır | OpenAI API anahtarı (chatbot) |
| `NEXT_PUBLIC_GA_ID` | Hayır | Google Analytics ID |

> `RESEND_API_KEY` tanımlı değilse formlar yine çalışır; e-postalar konsola loglanır.

---

## Komutlar

```bash
npm run dev      # Geliştirme sunucusu (Turbopack)
npm run build    # Production build
npm run start    # Production sunucu
npm run lint     # ESLint kontrolü
```

---

## Klasör Yapısı

```
├── docs/                        # SQL migration dosyaları ve teknik dokümanlar
│   ├── supabase-schema.sql              # Temel schema
│   ├── supabase-migration-002.sql       # B2B portal tabloları
│   ├── supabase-migration-003.sql       # Galeri sistemi
│   ├── DATABASE_SCHEMA.md              # Veritabanı dokümantasyonu
│   ├── B2B_PORTAL.md                   # Portal kullanım kılavuzu
│   └── VISUALIZER.md                   # 3D görselleştirici dokümantasyonu
├── public/                      # Statik dosyalar
│   ├── fonts/                   # Myriad Pro (woff2)
│   ├── sertifikalar/            # ISO sertifika PDF'leri
│   ├── .well-known/             # Android asset links (TWA)
│   ├── manifest.json            # PWA manifest
│   └── sw.js                    # Service worker
├── src/
│   ├── app/
│   │   ├── [locale]/            # Dil bazlı sayfalar (tr/en)
│   │   │   ├── bayi-girisi/     # Bayi login
│   │   │   ├── bayi-kayit/      # Bayi kayıt
│   │   │   ├── bayi-panel/      # B2B portal (dashboard, siparişler, teklifler, profil)
│   │   │   ├── urunler/         # Ürün kataloğu + detay
│   │   │   ├── urun-olustur/    # Ürün görselleştirici
│   │   │   ├── blog/            # Blog
│   │   │   └── ...              # Diğer sayfalar
│   │   ├── admin/               # Admin paneli
│   │   │   ├── products/        # Ürün yönetimi
│   │   │   ├── blog/            # Blog yönetimi
│   │   │   ├── gallery/         # Galeri yönetimi
│   │   │   └── dealers/         # Bayi yönetimi
│   │   └── api/                 # API route'ları
│   │       ├── auth/            # Login, register
│   │       ├── admin/           # Admin CRUD
│   │       ├── orders/          # Sipariş API
│   │       ├── quotes/          # Teklif API
│   │       └── ...              # Diğer API'lar
│   ├── components/
│   │   ├── layout/              # Header, Footer
│   │   ├── sections/            # Ana sayfa bölümleri
│   │   ├── pages/               # Sayfa client bileşenleri
│   │   ├── seo/                 # JSON-LD yapısal veri
│   │   └── ui/                  # Tekrar kullanılabilir bileşenler (shadcn/ui + özel)
│   ├── contexts/                # React Context (Locale, Theme)
│   ├── hooks/                   # Custom hook'lar
│   ├── lib/                     # Yardımcı modüller
│   │   ├── supabase.ts          # Genel Supabase client
│   │   ├── supabase-browser.ts  # Browser SSR client
│   │   ├── supabase-server.ts   # Server SSR client
│   │   ├── auth.ts              # Auth yardımcıları
│   │   ├── i18n.ts              # Çeviri sistemi
│   │   └── rate-limit.ts        # Rate limiting
│   ├── locales/                 # Çeviri dosyaları (tr.json, en.json)
│   └── types/                   # TypeScript tip tanımları
├── .claude/                     # AI agent yapılandırması
├── ARCHITECTURE.md              # Mimari dokümantasyon
├── CLAUDE.md                    # AI asistan kuralları
└── vercel.json                  # Vercel deployment yapılandırması
```

---

## Deployment

### Vercel

1. [Vercel](https://vercel.com) üzerinde yeni proje oluştur ve GitHub repo'sunu bağla
2. Environment variables'ları Vercel Dashboard'dan ekle
3. Build komutu: `npm run build`
4. Region: `fra1` (Frankfurt)

### Android TWA

Android TWA yapılandırması `twa/` klasöründe bulunur. Google Play Store'a yayınlama için Bubblewrap kullanılır.

---

## Dokümantasyon

| Doküman | Açıklama |
|---------|----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Mimari yapı, route organizasyonu, veri akışı |
| [docs/DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) | Veritabanı tabloları, ilişkiler, RLS politikaları |
| [docs/B2B_PORTAL.md](./docs/B2B_PORTAL.md) | Bayi portalı kullanım kılavuzu |
| [docs/VISUALIZER.md](./docs/VISUALIZER.md) | 2D/3D görselleştirici teknik dokümantasyonu |
| [CLAUDE.md](./CLAUDE.md) | AI asistan kuralları ve proje konvansiyonları |

---

## Lisans

Bu proje özel mülkiyettir. Tüm hakları Kısmet Plastik'e aittir.
