"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { useConfiguratorStore } from "@/stores/useConfiguratorStore";
import { useQuoteCart } from "@/stores/useQuoteCart";
import { products } from "@/data/products";
import type { Product } from "@/types/product";
import type { ProductAccessory, ColorOption } from "@/types/configurator";
import { cn } from "@/lib/utils";
import Preview2D from "./Preview2D";
import ColorPicker from "./ColorPicker";
import AccessorySelector from "./AccessorySelector";

export default function ConfiguratorClient() {
  const { locale, dict } = useLocale();
  const t = dict.configurator;
  const store = useConfiguratorStore();
  const addToQuote = useQuoteCart((s) => s.addItem);

  const [viewMode, setViewMode] = useState<"2d" | "3d">("2d");
  const [quantity, setQuantity] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [addedToQuote, setAddedToQuote] = useState(false);

  // Filter only bottles (products from bottle categories)
  const bottleCategories = ["pet-siseler", "plastik-siseler"];
  const configurableProducts = products.filter((p) =>
    bottleCategories.includes(p.category)
  );

  // Load configurator data when product is selected
  const loadConfiguratorData = useCallback(
    async (productId: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/configurator/${productId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.accessories) {
            store.setAccessories(data.accessories as ProductAccessory[]);
          }
          if (data.bodyColors) {
            store.setBodyColors(data.bodyColors as ColorOption[]);
            const defaultColor = (data.bodyColors as ColorOption[]).find(
              (c) => c.is_default
            );
            if (defaultColor) store.setBodyColor(defaultColor);
          }
        }
      } catch {
        // API not available, use fallback static colors
        const fallbackColors: ColorOption[] = [
          {
            id: "fc-1",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Şeffaf",
            color_name_en: "Transparent",
            color_name_ar: null,
            color_hex: "#e8f4fd",
            opacity: 0.3,
            metallic: 0,
            is_default: true,
            preview_image_url: null,
            sort_order: 0,
          },
          {
            id: "fc-2",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Beyaz",
            color_name_en: "White",
            color_name_ar: null,
            color_hex: "#f5f5f5",
            opacity: 1,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 1,
          },
          {
            id: "fc-3",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Amber",
            color_name_en: "Amber",
            color_name_ar: null,
            color_hex: "#ff8f00",
            opacity: 0.8,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 2,
          },
          {
            id: "fc-4",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Füme",
            color_name_en: "Smoke",
            color_name_ar: null,
            color_hex: "#616161",
            opacity: 0.7,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 3,
          },
          {
            id: "fc-5",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Siyah",
            color_name_en: "Black",
            color_name_ar: null,
            color_hex: "#333333",
            opacity: 1,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 4,
          },
          {
            id: "fc-6",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Mavi",
            color_name_en: "Blue",
            color_name_ar: null,
            color_hex: "#4a90d9",
            opacity: 0.9,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 5,
          },
          {
            id: "fc-7",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Yeşil",
            color_name_en: "Green",
            color_name_ar: null,
            color_hex: "#4caf50",
            opacity: 0.9,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 6,
          },
          {
            id: "fc-8",
            target_type: "product",
            target_id: productId,
            color_name_tr: "Pembe",
            color_name_en: "Pink",
            color_name_ar: null,
            color_hex: "#ec407a",
            opacity: 0.9,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 7,
          },
        ];
        store.setBodyColors(fallbackColors);
        store.setBodyColor(fallbackColors[0]);
      } finally {
        setLoading(false);
      }
    },
    [store]
  );

  // Load accessory colors when an accessory is selected
  const loadAccessoryColors = useCallback(
    async (accessoryTypeId: string) => {
      try {
        const res = await fetch(
          `/api/configurator/colors?target_type=accessory&target_id=${accessoryTypeId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.colors) {
            store.setAccessoryColors(data.colors as ColorOption[]);
            const defaultColor = (data.colors as ColorOption[]).find(
              (c) => c.is_default
            );
            if (defaultColor) store.setAccessoryColor(defaultColor);
          }
        }
      } catch {
        // Fallback accessory colors
        const fallbackColors: ColorOption[] = [
          {
            id: "ac-1",
            target_type: "accessory",
            target_id: accessoryTypeId,
            color_name_tr: "Beyaz",
            color_name_en: "White",
            color_name_ar: null,
            color_hex: "#f5f5f5",
            opacity: 1,
            metallic: 0,
            is_default: true,
            preview_image_url: null,
            sort_order: 0,
          },
          {
            id: "ac-2",
            target_type: "accessory",
            target_id: accessoryTypeId,
            color_name_tr: "Siyah",
            color_name_en: "Black",
            color_name_ar: null,
            color_hex: "#333333",
            opacity: 1,
            metallic: 0,
            is_default: false,
            preview_image_url: null,
            sort_order: 1,
          },
          {
            id: "ac-3",
            target_type: "accessory",
            target_id: accessoryTypeId,
            color_name_tr: "Altın",
            color_name_en: "Gold",
            color_name_ar: null,
            color_hex: "#ffc107",
            opacity: 1,
            metallic: 0.8,
            is_default: false,
            preview_image_url: null,
            sort_order: 2,
          },
          {
            id: "ac-4",
            target_type: "accessory",
            target_id: accessoryTypeId,
            color_name_tr: "Gümüş",
            color_name_en: "Silver",
            color_name_ar: null,
            color_hex: "#bdbdbd",
            opacity: 1,
            metallic: 0.8,
            is_default: false,
            preview_image_url: null,
            sort_order: 3,
          },
        ];
        store.setAccessoryColors(fallbackColors);
        store.setAccessoryColor(fallbackColors[0]);
      }
    },
    [store]
  );

  const handleProductSelect = useCallback(
    (product: Product) => {
      store.setProduct(product);
      loadConfiguratorData(product.id);
      setAddedToQuote(false);
    },
    [store, loadConfiguratorData]
  );

  const handleAccessorySelect = useCallback(
    (accessory: ProductAccessory) => {
      store.setAccessory(accessory);
      if (accessory.accessory_type_id) {
        loadAccessoryColors(accessory.accessory_type_id);
      }
    },
    [store, loadAccessoryColors]
  );

  const handleAddToQuote = useCallback(() => {
    if (!store.product) return;

    const colorName =
      locale === "en"
        ? store.bodyColor?.color_name_en || store.bodyColor?.color_name_tr
        : store.bodyColor?.color_name_tr;

    const accName =
      locale === "en"
        ? store.accessory?.accessory_type?.name_en ||
          store.accessory?.accessory_type?.name_tr
        : store.accessory?.accessory_type?.name_tr;

    const accColorName =
      locale === "en"
        ? store.accessoryColor?.color_name_en ||
          store.accessoryColor?.color_name_tr
        : store.accessoryColor?.color_name_tr;

    addToQuote({
      productId: store.product.id,
      productName: store.product.name,
      quantity,
      bodyColorHex: store.bodyColor?.color_hex,
      bodyColorName: colorName || undefined,
      accessoryId: store.accessory?.accessory_type_id,
      accessoryName: accName || undefined,
      accessoryColorHex: store.accessoryColor?.color_hex,
      accessoryColorName: accColorName || undefined,
    });

    setAddedToQuote(true);
    setTimeout(() => setAddedToQuote(false), 3000);
  }, [store, addToQuote, quantity, locale]);

  // Share configuration via URL
  useEffect(() => {
    if (!store.product) return;
    const params = new URLSearchParams();
    params.set("urun", store.product.slug);
    if (store.bodyColor) params.set("renk", store.bodyColor.color_hex);
    if (store.accessory?.accessory_type)
      params.set("aksesuar", store.accessory.accessory_type.slug);
    if (store.accessoryColor)
      params.set("aksesuar_renk", store.accessoryColor.color_hex);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    store.product,
    store.bodyColor,
    store.accessory,
    store.accessoryColor,
  ]);

  // Load from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const productSlug = params.get("urun");
    if (productSlug) {
      const found = configurableProducts.find((p) => p.slug === productSlug);
      if (found) handleProductSelect(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0D0D0D]/95 px-4 py-4 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-xl font-semibold text-white sm:text-2xl">
            {t.title}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left: Preview (60% on desktop) */}
          <div className="flex flex-col items-center lg:w-[60%]">
            {viewMode === "2d" ? (
              <Preview2D
                productSlug={store.product?.slug || null}
                bodyColor={store.bodyColor}
                accessorySlug={
                  store.accessory?.accessory_type?.slug || null
                }
                accessoryColor={store.accessoryColor}
                className="w-full"
              />
            ) : (
              <div className="flex aspect-[3/4] w-full max-w-[400px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0D0D0D]">
                <div className="flex flex-col items-center gap-4 text-white/40">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-40"
                  >
                    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                    <path d="M12 12l8-4.5" />
                    <path d="M12 12v9" />
                    <path d="M12 12L4 7.5" />
                  </svg>
                  <p className="text-center text-sm">{t.comingSoon3d}</p>
                </div>
              </div>
            )}

            {/* View mode toggle */}
            <div className="mt-4 flex gap-2 rounded-lg border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setViewMode("2d")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm transition-all",
                  viewMode === "2d"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                2D
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm transition-all",
                  viewMode === "3d"
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/60"
                )}
              >
                3D
              </button>
            </div>
          </div>

          {/* Right: Options panel (40% on desktop) */}
          <div className="space-y-6 lg:w-[40%]">
            {/* Step 1: Product selection */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h2 className="mb-3 text-sm font-medium text-white/70">
                {t.selectProduct}
              </h2>
              <div className="grid max-h-[200px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                {configurableProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all",
                      store.product?.id === product.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-white/10 hover:border-white/20"
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center text-lg text-white/40">
                      ⬡
                    </div>
                    <span className="line-clamp-2 text-[10px] leading-tight text-white/70">
                      {product.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Body color */}
            {store.product && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ColorPicker
                  colors={store.bodyColors}
                  selected={store.bodyColor}
                  onSelect={store.setBodyColor}
                  label={t.bodyColor}
                  locale={locale}
                />
              </div>
            )}

            {/* Step 3: Accessory selection */}
            {store.product && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="mb-3 text-sm font-medium text-white/70">
                  {t.selectAccessory}
                </h2>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-amber-500" />
                  </div>
                ) : (
                  <AccessorySelector
                    accessories={store.accessories}
                    selected={store.accessory}
                    onSelect={handleAccessorySelect}
                    locale={locale}
                    labels={{
                      compatibleCaps: t.compatibleCaps,
                      compatiblePumps: t.compatiblePumps,
                      compatibleSprays: t.compatibleSprays,
                      noAccessories: t.noAccessories,
                    }}
                  />
                )}
              </div>
            )}

            {/* Step 4: Accessory color */}
            {store.accessory && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <ColorPicker
                  colors={store.accessoryColors}
                  selected={store.accessoryColor}
                  onSelect={store.setAccessoryColor}
                  label={t.accessoryColor}
                  locale={locale}
                />
              </div>
            )}

            {/* Step 5: Actions */}
            {store.product && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <label className="text-sm text-white/50">Adet:</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={handleAddToQuote}
                  className={cn(
                    "w-full rounded-xl py-3 text-sm font-semibold transition-all",
                    addedToQuote
                      ? "bg-green-500/20 text-green-400"
                      : "bg-amber-500 text-[#0A1628] hover:bg-amber-400"
                  )}
                >
                  {addedToQuote ? "✓ Eklendi" : t.addToQuote}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
