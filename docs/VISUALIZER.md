# 2D/3D Ürün Görselleştirici — Teknik Dokümantasyon

Bu doküman Kısmet Plastik'in ürün görselleştirme sisteminin teknik detaylarını açıklar.

---

## Genel Bakış

Ürün görselleştirici, müşterilerin ambalaj ürünlerini 2D ve 3D olarak inceleyebileceği ve renk özelleştirebileceği bir sistemdir. İki modda çalışır:

- **2D Görüntüleyici:** SVG tabanlı, Framer Motion animasyonlu
- **3D Görüntüleyici:** Three.js (React Three Fiber) tabanlı, interaktif

Görselleştirici ürün detay sayfasında (`/urunler/[category]/[slug]`) sekmeli arayüz ile sunulur.

---

## Mimari

### Bileşen Yapısı

```
ProductDetailClient (src/components/pages/ProductDetailClient.tsx)
├── ProductViewer (2D — src/components/ui/ProductViewer.tsx)
│   └── ProductSVG (src/components/ui/ProductSVG.tsx)
└── Product3DViewer (3D — src/components/ui/Product3DViewer.tsx)  [lazy loaded]
    ├── Scene
    │   ├── Lighting (ambient + directional + point)
    │   ├── ProductModel (kategori bazlı seçim)
    │   │   ├── BottleModel
    │   │   ├── CapModel
    │   │   ├── SprayModel
    │   │   ├── PumpModel
    │   │   └── FunnelModel
    │   ├── Float (animasyon)
    │   ├── ContactShadows
    │   ├── Environment (city HDRI)
    │   └── OrbitControls
    └── LoadingFallback
```

### Bağımlılıklar

```json
{
  "@react-three/fiber": "^9.5.0",
  "@react-three/drei": "^10.7.7",
  "three": "^0.183.1",
  "framer-motion": "^12.34.3"
}
```

---

## 3D Görüntüleyici

### Canvas Yapılandırması

```typescript
<Canvas
  camera={{ position: [0, 1, 5], fov: 40 }}
  gl={{ antialias: true, alpha: true }}
>
```

| Parametre | Değer | Açıklama |
|-----------|-------|----------|
| Kamera pozisyon | `[0, 1, 5]` | Ürünün biraz üstünden bakış |
| FOV | 40° | Dar görüş açısı (ürüne yakın) |
| Antialias | Aktif | Kenar yumuşatma |
| Alpha | Aktif | Şeffaf arka plan |
| Min height | 420px (normal), 100vh (fullscreen) | Minimum yükseklik |

### Işık Sistemi

```typescript
<ambientLight intensity={0.3} />
<directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
<directionalLight position={[-4, 3, -4]} intensity={0.4} />
<pointLight position={[0, 6, 3]} intensity={0.2} color="#e0e8ff" />
```

| Işık | Pozisyon | Yoğunluk | Görev |
|------|----------|----------|-------|
| Ambient | — | 0.3 | Genel aydınlatma |
| Directional (ana) | `[5, 8, 5]` | 1.2 | Ana gölge ışığı |
| Directional (dolgu) | `[-4, 3, -4]` | 0.4 | Karanlık bölgeleri yumuşatma |
| Point | `[0, 6, 3]` | 0.2 | Üstten vurgu |

### Kamera Kontrolleri (OrbitControls)

```typescript
<OrbitControls
  enablePan={false}
  minPolarAngle={Math.PI / 5}
  maxPolarAngle={Math.PI / 1.6}
  minDistance={3.5}
  maxDistance={7}
  autoRotate
  autoRotateSpeed={0.8}
  enableDamping
  dampingFactor={0.05}
/>
```

| Kontrol | Değer | Açıklama |
|---------|-------|----------|
| Pan | Kapalı | Sadece döndürme ve yakınlaştırma |
| Polar açı | π/5 — π/1.6 | Aşırı alt/üst görünüm engellenir |
| Mesafe | 3.5 — 7 | Zoom sınırları |
| Auto-rotate | 0.8°/frame | Otomatik döndürme |
| Damping | 0.05 | Yavaşlama efekti |

### Ek Efektler

| Efekt | Kaynak | Parametreler |
|-------|--------|-------------|
| Float | `@react-three/drei` | speed: 1.2, rotationIntensity: 0.15, floatIntensity: 0.2 |
| ContactShadows | `@react-three/drei` | opacity: 0.35, scale: 4, blur: 2, far: 3 |
| Environment | `@react-three/drei` | preset: "city" (HDRI reflections) |

---

## 3D Modeller

### Kategori → Model Eşleştirmesi

| Kategori | Model Tipi | Açıklama |
|----------|-----------|----------|
| `pet-siseler` | BottleModel | PET şişeler |
| `plastik-siseler` | BottleModel | HDPE/PP/LDPE şişeler |
| `kapaklar` | CapModel | Kapaklar |
| `tipalar` | CapModel | Tıpalar |
| `parmak-spreyler` | SprayModel | Parmak spreyleri |
| `pompalar` | PumpModel | Pompa mekanizmaları |
| `tetikli-pusturtuculer` | SprayModel | Tetikli püskürtücüler |
| `huniler` | FunnelModel | Huniler |

### BottleModel

Silindirik şişe modeli. 4 geometri parçasından oluşur:

| Parça | Geometri | Pozisyon | Malzeme |
|-------|----------|----------|---------|
| Kapak üstü | Silindir (r: 0.25, h: 0.4) | y: 2.3 | Metalik lacivert (#1a237e) |
| Boyun | Silindir (r: 0.3→0.45, h: 0.4) | y: 2.0 | Ürün rengi (physical) |
| Gövde | Silindir (r: 0.55, h: 2.0) | y: 0.8 | Ürün rengi (physical) |
| Taban | Silindir (r: 0.55→0.50, h: 0.5) | y: -0.4 | Ürün rengi (physical) |
| Etiket alanı | Box (0.6 × 0.9) | z: 0.56 | Beyaz, opacity: 0.12 |

**Malzeme Özellikleri (meshPhysicalMaterial):**

```typescript
{
  color: bodyColor,
  transparent: isTransparent,
  opacity: isTransparent ? 0.55 : 0.95,
  roughness: 0.12,
  metalness: 0.05,
  clearcoat: isTransparent ? 1 : 0.3,
  clearcoatRoughness: 0.1,
  ior: 1.5,
  thickness: isTransparent ? 0.5 : 0,
  envMapIntensity: 1.5,
}
```

**Rotasyon:** 0.25 radyan/frame (y ekseni)

### CapModel

Silindirik kapak modeli. Dış yüzeyinde 24 tırtıl çizgisi:

| Parça | Açıklama |
|-------|----------|
| Üst disk | Düz üst yüzey |
| Ana gövde | Kapak silindir gövdesi |
| Tırtıllar | 24 adet dikdörtgen prizma (çevresel dağılım) |
| İç halka | Alt kısım bağlantı halkası |

### SprayModel

Sprey/tetikli püskürtücü modeli:

| Parça | Açıklama |
|-------|----------|
| Mekanizma gövde | Metalik gri silindir |
| Tetik çubuğu | Açılı silindir |
| Tetik ucu | Küre |
| Boyun | Geçiş silindiri |
| Ana gövde | Uzun silindir |
| Taban | Konik silindir |

### PumpModel

Pompa mekanizması modeli:

| Parça | Açıklama |
|-------|----------|
| Pompa başlığı | Metalik disk |
| Pompa çubuğu | İnce silindir |
| Bağlantı borusu | Yatay silindir |
| Pompa halkası | Metalik halka |
| Şişe gövdesi | Ana silindir |
| Taban | Konik silindir |

### FunnelModel

Huni modeli:

| Parça | Açıklama |
|-------|----------|
| Koni | Ters koni (r: 0.7→0.2, h: 1.0) — çift taraflı render |
| Ağız | Düz silindir (r: 0.2, h: 0.6) |

---

## 2D Görüntüleyici

### SVG Render Tipleri

`ProductSVG` bileşeni aşağıdaki tipleri destekler:

| Tip | Boyut | Kullanım |
|-----|-------|----------|
| `bottle` | 144px yükseklik | PET/Plastik şişeler |
| `jar` | 120px yükseklik | Kavanoz tipi kaplar |
| `cap` | 64px yükseklik | Kapaklar, tıpalar |
| `spray` | 128px yükseklik | Spreyler, püskürtücüler |
| `preform` | 128px yükseklik | Alternatif sprey |
| `set` | 150px yükseklik | Şişe + kapak kombo |

### SVG Özellikleri

- Düz renk dolgular (brand color mapping)
- Kontur çizgileri
- Beyaz highlight'lar (3D illüzyonu)
- Gölge elipsleri (derinlik hissi)
- Grid çizgiler (kapak tırtılları)
- Yarı şeffaf parlaklık katmanları

### 2D Kontroller

| Kontrol | Fonksiyon | Animasyon |
|---------|----------|-----------|
| Yakınlaştır | 1x → 1.4x ölçek | Spring (stiffness: 200, damping: 20) |
| Sıfırla | Varsayılan renk ve zoom | — |
| Renk Seçici | 16 renk paleti | Scale (1.15x hover) + checkmark |

### Framer Motion Animasyonları

**Zoom:**
```typescript
animate={{ scale: isZoomed ? 1.4 : 1 }}
whileHover={{ scale: isZoomed ? 1.45 : 1.06 }}
```

**Renk Değişimi:**
```typescript
<AnimatePresence mode="wait">
  <motion.div
    key={selectedColor}
    initial={{ opacity: 0.6, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0.6, scale: 0.95 }}
  />
</AnimatePresence>
```

---

## Renk Sistemi

### Renk Haritası

16 önceden tanımlı renk desteklenir:

| Türkçe Ad | Hex Kodu | Açıklama |
|-----------|----------|----------|
| Şeffaf | `#e8f4fd` | Açık mavi (şeffaf plastik temsili) |
| Mavi | `#4a90d9` | Orta mavi |
| Yeşil | `#4caf50` | Yeşil |
| Amber | `#ff8f00` | Amber/turuncu |
| Beyaz | `#f5f5f5` | Kırık beyaz |
| Siyah | `#333333` | Koyu gri-siyah |
| Kırmızı | `#e53935` | Kırmızı |
| Füme | `#616161` | Füme gri |
| Pembe | `#ec407a` | Pembe |
| Mor | `#7b1fa2` | Mor |
| Sarı | `#fdd835` | Sarı |
| Turuncu | `#ff9800` | Turuncu |
| Lacivert | `#1a237e` | Lacivert |
| Gri | `#9e9e9e` | Orta gri |
| Gümüş | `#bdbdbd` | Gümüş |
| Altın | `#ffc107` | Altın |

### Şeffaf Malzeme İşleme

"Şeffaf" renk özel malzeme parametreleri alır:

| Parametre | Normal | Şeffaf |
|-----------|--------|--------|
| opacity | 0.95 | 0.55 |
| clearcoat | 0.3 | 1.0 |
| thickness | 0 | 0.5 |

---

## Dynamic Import Stratejisi

3D görüntüleyici performans için lazy load edilir:

```typescript
// ProductDetailClient.tsx
const Product3DViewer = lazy(
  () => import("@/components/ui/Product3DViewer")
);

// Kullanım
<Suspense fallback={<LoadingFallback />}>
  <Product3DViewer product={product} selectedColor={selectedColor} />
</Suspense>
```

**Yükleme stratejisi:**
- Sayfa ilk açıldığında 2D görünüm aktif (varsayılan)
- Kullanıcı "3D" sekmesine tıkladığında Three.js bundle yüklenir
- `LoadingFallback`: Spinner + "3D..." metni
- Three.js bundle (~500KB gzipped) sadece ihtiyaç duyulduğunda indirilir

### Bundle Etkisi

| Bileşen | Tahmini Boyut | Yükleme |
|---------|--------------|---------|
| ProductViewer (2D) | ~5KB | Anında (sayfa ile) |
| Product3DViewer (3D) | ~500KB (three.js dahil) | Lazy (sekme tıklama) |
| ProductSVG | ~3KB | Anında (sayfa ile) |

---

## State Yönetimi

### ProductDetailClient State

```typescript
const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
const [selectedColor, setSelectedColor] = useState<string | undefined>();
```

### Veri Akışı

```
ProductDetailClient
├── viewMode state ←→ Tab butonları (2D/3D)
├── selectedColor state ←→ ProductViewer.onColorChange callback
├── ↓ selectedColor prop → ProductViewer
└── ↓ selectedColor prop → Product3DViewer
```

1. Kullanıcı 2D görünümde renk seçer
2. `onColorChange` callback tetiklenir
3. `selectedColor` state güncellenir
4. Her iki viewer da yeni renkle render edilir
5. 3D'ye geçildiğinde aynı renk korunur

---

## Erişilebilirlik

### ARIA Desteği

```typescript
// Tam ekran butonu
aria-label={isFullscreen ? dict.components.reset : dict.components.zoomIn}

// Renk seçici butonları
aria-label={`Renk: ${color}`}
aria-pressed={isSelected}
```

### Renk Kontrastı

Renk seçici checkmark'ı arka plan rengine göre adapte olur:
- Açık renkler (Beyaz, Şeffaf, Sarı, Altın): Koyu checkmark
- Koyu renkler: Beyaz checkmark

### Hareket Tercihi

Framer Motion `prefers-reduced-motion` media query'sini otomatik destekler.

---

## Responsive Tasarım

| Ekran | Davranış |
|-------|----------|
| Mobil (<768px) | Tek sütun, min-height: 320px |
| Tablet (768px-1024px) | Tek sütun, min-height: 420px |
| Desktop (>1024px) | İki sütun (görselleştirici + ürün bilgileri) |
| Fullscreen | 100vh, tüm ekran |

### Touch Desteği

- 3D: Parmak ile döndürme, pinch-to-zoom
- 2D: Renk butonlarına dokunma

---

## Geliştirme Notları

### Yeni Ürün Tipi Ekleme (3D)

1. `Product3DViewer.tsx`'e yeni model bileşeni ekle:
```typescript
function NewModel({ color }: { color: string }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });
  return (
    <group ref={groupRef}>
      {/* Three.js geometrileri */}
    </group>
  );
}
```

2. `categoryTo3DModel` map'ini güncelle
3. `ProductModel` switch case'ine ekle

### Yeni Renk Ekleme

1. `ProductSVG.tsx`'teki `colorMap`'e ekle
2. `ProductCard.tsx`'teki `colorHexMap`'e ekle
3. Ürün verisine Türkçe renk adını ekle

### GLB Model Desteği (Gelecek)

Mevcut sistemde 3D modeller prosedürel geometri ile oluşturulur. GLB model desteği eklemek için:

1. Supabase Storage'a GLB dosyası yükle
2. `@react-three/drei`'nin `useGLTF` hook'unu kullan:
```typescript
import { useGLTF } from "@react-three/drei";

function LoadedModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
```
3. `product.model_3d_url` alanını kontrol et
4. URL varsa GLB yükle, yoksa prosedürel model göster
