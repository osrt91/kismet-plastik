# Kismet Plastik B2B

Next.js ile gelistirilmis Kismet Plastik kurumsal / B2B web uygulamasi.

**Canli:** [kismetplastik.vercel.app](https://kismetplastik.vercel.app)

---

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS 4, Framer Motion, Lucide Icons
- **3D:** React Three Fiber + Drei
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Email:** Resend
- **AI:** OpenAI GPT-4o-mini (chatbot)
- **Deploy:** Vercel (fra1)
- **PWA:** Service Worker, manifest.json, install prompt

---

## Baslarken

```bash
npm install
npm run dev
```

Tarayicida [http://localhost:3000](http://localhost:3000) adresini acin.

---

## Ozellikler

| Ozellik | Durum |
|---------|-------|
| 86 sayfa (TR/EN cift dil) | Tamamlandi |
| Urun katalog (8 kategori, 23+ urun, filtreleme, arama) | Tamamlandi |
| 3D urun viewer (React Three Fiber) | Tamamlandi |
| Dark mode | Tamamlandi |
| PWA + Service Worker + Install prompt | Tamamlandi |
| AI Chatbot (OpenAI) | Tamamlandi |
| WhatsApp Business widget (3 agent) | Tamamlandi |
| Iletisim + Teklif formu (Resend email) | Tamamlandi |
| Blog sistemi (Supabase CRUD) | Tamamlandi |
| Admin paneli (urun + blog + galeri + icerik yonetimi) | Tamamlandi |
| Bayi paneli (giris, kayit, siparis, teklif) | Tamamlandi |
| Galeri sistemi (Supabase Storage) | Tamamlandi |
| SEO (sitemap, robots.txt, JSON-LD, meta tags) | Tamamlandi |
| Video hero background | Tamamlandi |
| Referans logo carousel | Tamamlandi |
| Sertifika & kalite bolumu (PDF indirme) | Tamamlandi |
| Sektor tab-bazli bolum | Tamamlandi |
| Ambalaj sozlugu (36 terim) | Tamamlandi |
| Urun konfigurator (6 adim) | Tamamlandi |
| Mega menu | Tamamlandi |
| HSTS + CSP guvenlik basliklari | Tamamlandi |
| Vercel production deploy | Tamamlandi |

---

## E-posta (Iletisim & Teklif formlari)

Iletisim ve Teklif Al formlari **Resend** ile e-posta gonderir. Canli ortamda calismasi icin:

1. [Resend](https://resend.com) hesabi acin ve API anahtari alin.
2. Proje kokunde `.env.local` olusturun (`.env.example` ornek alinabilir):

```env
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=info@kismetplastik.com
```

3. `EMAIL_FROM` icin Resend'te dogrulanmis bir domain kullanin.

`RESEND_API_KEY` yoksa formlar basarili yanit doner; e-posta sadece konsola loglanir.

---

## Veritabani (Supabase)

SQL migration dosyalari `docs/` klasorunde:

| Dosya | Aciklama |
|-------|----------|
| `docs/supabase-schema.md` | Ana sema (categories, products, blog_posts) |
| `docs/supabase-migration-002.md` | Bayi portal & siparis sistemi |
| `docs/supabase-migration-003.md` | Galeri sistemi |

Sira: schema → migration-002 → migration-003

---

## Kalan Isler

| Oncelik | Gorev | Durum |
|---------|-------|-------|
| 1 | Play Store TWA: `twa/PLAY-STORE-REHBER.md` rehberini takip et | Bekliyor |
| 2 | Custom domain (kismetplastik.com) + DNS (Vercel) | Opsiyonel |
| 3 | Resend API key: gercek key alip Vercel env'de guncelle | Opsiyonel |

---

## Build

```bash
npm run build
```

*Son guncelleme: 1 Mart 2026*
