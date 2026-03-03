# B2B Bayi Portalı Kullanım Kılavuzu

Bu doküman Kısmet Plastik bayi portalının işleyişini ve kullanımını açıklar.

---

## Genel Bakış

Bayi portalı, Kısmet Plastik'in B2B müşterilerinin (bayiler) sipariş oluşturabileceği, teklif talep edebileceği ve hesap bilgilerini yönetebileceği özel bir alandır. Portala erişim için kayıt ve admin onayı gereklidir.

**Portal URL:** `/[locale]/bayi-panel`

---

## Kayıt ve Onay Süreci

### 1. Bayilik Başvurusu

Bayi olmak isteyen firmalar `/bayi-kayit` sayfasından başvuru yapar.

**Gerekli Bilgiler:**

| Alan | Zorunlu | Açıklama |
|------|---------|----------|
| E-posta | Evet | Giriş e-postası |
| Şifre | Evet | Min 8 karakter |
| Ad Soyad | Evet | Yetkili kişi |
| Firma Adı | Evet | Ticari unvan |
| Telefon | Hayır | İletişim numarası |
| Vergi Numarası | Hayır | Firma vergi no |
| Vergi Dairesi | Hayır | Vergi dairesi adı |
| Firma Adresi | Hayır | İş adresi |
| İl | Hayır | Şehir |
| İlçe | Hayır | İlçe |

**API Endpoint:** `POST /api/auth/register`

**Rate Limit:** 3 başvuru / 5 dakika (IP bazlı)

### 2. Onay Beklemesi

Kayıt sonrası kullanıcının durumu:
- **role:** `dealer`
- **is_approved:** `false`

Kullanıcı giriş yapmaya çalıştığında **"Bayilik başvurunuz henüz onaylanmadı"** mesajı görür.

### 3. Admin Onayı

Admin panelinden (`/admin/dealers`) bayi başvuruları incelenir ve onaylanır:
- `is_approved: true` olarak güncellenir
- Onaylanan bayi portalı kullanabilir

### 4. Giriş

Onaylanan bayiler `/bayi-girisi` sayfasından giriş yapar.

**Giriş Bilgileri:**
- E-posta
- Şifre

**API Endpoint:** `POST /api/auth/login`

**Rate Limit:** 5 deneme / 5 dakika (IP bazlı)

**Giriş Kontrolü:**
1. E-posta + şifre doğrulama (Supabase Auth)
2. Profil kontrolü: `role = dealer` ve `is_approved = true` olmalı
3. Başarılıysa session cookie set edilir ve portala yönlendirilir

---

## Dashboard

**URL:** `/[locale]/bayi-panel`

Dashboard, bayinin genel durumunu gösteren ana sayfadır.

### İstatistik Kartları

| Kart | Açıklama | Hesaplama |
|------|----------|-----------|
| Aktif Siparişler | Devam eden sipariş sayısı | status IN (pending, confirmed, production, shipping) |
| Bekleyen Teklifler | Yanıt bekleyen teklif sayısı | status IN (pending, reviewing) |
| Toplam Sipariş | Tüm zamanların sipariş sayısı | Tüm siparişler |
| Ürün Çeşidi | Katalogdaki toplam ürün sayısı | Tüm ürünler |

### Hızlı İşlemler

| Buton | Hedef | Açıklama |
|-------|-------|----------|
| Yeni Teklif Al | `/teklif-al` | Teklif talep formu |
| Ürünleri İncele | `/urunler` | Ürün kataloğu |
| Siparişlerimi Gör | `/bayi-panel/siparislerim` | Sipariş listesi |

### Son Aktiviteler

Son sipariş ve teklif işlemlerinin zaman çizelgesi.

---

## Portal Menüsü

Sidebar navigasyonu aşağıdaki bölümleri içerir:

| Menü | URL | Açıklama |
|------|-----|----------|
| Dashboard | `/bayi-panel` | Ana sayfa, istatistikler |
| Ürünler | `/bayi-panel/urunler` | Ürün kataloğu (bayi fiyatlarıyla) |
| Tekliflerim | `/bayi-panel/tekliflerim` | Teklif talepleri listesi |
| Siparişlerim | `/bayi-panel/siparislerim` | Sipariş listesi ve detay |
| Profilim | `/bayi-panel/profilim` | Firma ve kişisel bilgiler |

---

## Sipariş Oluşturma

### Sipariş Akışı

```
1. Ürün Seçimi     → Ürün ve miktar belirleme
2. Adres Bilgileri  → Teslimat ve fatura adresi
3. Ödeme Yöntemi   → Ödeme tercihinin seçimi
4. Sipariş Onayı   → Özet kontrol ve gönderim
```

### Sipariş Oluşturma API'si

**Endpoint:** `POST /api/orders`

**İstek Gövdesi:**
```json
{
  "profile_id": "uuid",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "PET Şişe 250ml",
      "quantity": 5000,
      "unit_price": 0.85
    }
  ],
  "shipping_address": {
    "street": "Organize Sanayi Bölgesi",
    "city": "İstanbul",
    "district": "Beylikdüzü"
  },
  "payment_method": "havale",
  "notes": "Acil teslimat"
}
```

**Otomatik Hesaplama:**
- `subtotal` = Kalem toplamları
- `tax_amount` = subtotal × %20 (KDV)
- `total_amount` = subtotal + tax_amount

**Sipariş Numarası:** Otomatik oluşturulur (`KP-YYMM-NNNN` formatında)

### Sipariş Durumları

```
pending → confirmed → production → shipping → delivered
                                                 ↘ cancelled
```

| Durum | Açıklama | Renk |
|-------|----------|------|
| `pending` | Yeni sipariş, onay bekliyor | Sarı |
| `confirmed` | Admin tarafından onaylandı | Mavi |
| `production` | Üretim aşamasında | Mor |
| `shipping` | Kargoya verildi | Turuncu |
| `delivered` | Teslim edildi | Yeşil |
| `cancelled` | İptal edildi | Kırmızı |

Her durum değişikliği `order_status_history` tablosuna kaydedilir.

---

## Teklif Talep Etme

### Teklif Formu

**Endpoint:** `POST /api/quotes`

Bayiler belirli ürünler için fiyat teklifi talep edebilir.

**İstek Gövdesi:**
```json
{
  "company_name": "ABC Kozmetik Ltd.",
  "contact_name": "Ahmet Yılmaz",
  "email": "ahmet@abc.com.tr",
  "phone": "+90 212 555 0000",
  "message": "Yıllık 100.000 adet alım için fiyat istiyoruz",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "PET Şişe 500ml",
      "quantity": 100000,
      "notes": "Beyaz renk tercih"
    }
  ]
}
```

### Teklif Durumları

```
pending → reviewing → quoted → accepted
                            → rejected
```

| Durum | Açıklama |
|-------|----------|
| `pending` | Yeni teklif talebi |
| `reviewing` | İnceleniyor |
| `quoted` | Fiyat teklifi gönderildi |
| `accepted` | Kabul edildi |
| `rejected` | Reddedildi |

---

## Profil Yönetimi

**URL:** `/bayi-panel/profilim`

Bayiler profil sayfasından aşağıdaki bilgileri görüntüleyebilir ve güncelleyebilir:

| Alan | Düzenlenebilir | Açıklama |
|------|---------------|----------|
| E-posta | Hayır | Kayıt e-postası |
| Ad Soyad | Evet | Yetkili kişi |
| Telefon | Evet | İletişim numarası |
| Firma Adı | Evet | Ticari unvan |
| Vergi Numarası | Evet | Firma vergi no |
| Vergi Dairesi | Evet | Vergi dairesi |
| Firma Adresi | Evet | İş adresi |
| İl / İlçe | Evet | Konum bilgisi |

---

## Güvenlik

### Erişim Kontrolü

- Portal sayfaları middleware tarafından korunur (`src/proxy.ts`)
- Supabase auth session cookie kontrolü yapılır
- Cookie yoksa `/bayi-girisi`'ne yönlendirilir

### Veri İzolasyonu (RLS)

- Bayiler sadece **kendi** siparişlerini görebilir
- Bayiler sadece **kendi** tekliflerini görebilir
- Bayiler sadece **kendi** profillerini düzenleyebilir
- Diğer bayilerin verilerine erişim mümkün değildir

### Rate Limiting

| İşlem | Limit |
|-------|-------|
| Giriş denemesi | 5 / 5 dakika |
| Kayıt başvurusu | 3 / 5 dakika |
| Sipariş oluşturma | 5 / dakika |
| Teklif talep | 3 / dakika |

---

## Çıkış Yapma

Portal sidebar'ındaki "Çıkış Yap" butonu:
1. `supabase.auth.signOut()` çağrılır
2. Session cookie temizlenir
3. `/bayi-girisi` sayfasına yönlendirilir

---

## Teknik Detaylar

### Kullanılan Supabase Client'lar

| Bağlam | Client | Dosya |
|--------|--------|-------|
| Portal sayfaları (client) | `getSupabaseBrowser()` | `src/lib/supabase-browser.ts` |
| API Route Handler'lar | `getSupabase()` | `src/lib/supabase.ts` |
| Server Component'lar | `createSupabaseServerClient()` | `src/lib/supabase-server.ts` |

### Çoklu Dil Desteği

Portal arayüzü Türkçe ve İngilizce destekler:
- Tüm etiketler `labels` objesinde tanımlı
- `useLocale()` hook'u ile aktif dil alınır
- Tarihler locale'e göre formatlanır

### Responsive Tasarım

- **Mobil:** Sidebar hamburger menü ile açılır/kapanır
- **Tablet:** Sidebar overlay modunda
- **Desktop:** Sidebar sabit, yan yana layout
