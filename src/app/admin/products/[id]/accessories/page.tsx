"use client";

import { useParams } from "next/navigation";
import { useState, useReducer, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, X } from "lucide-react";
import { products } from "@/data/products";
import type { AccessoryType, ProductAccessory, ColorOption } from "@/types/configurator";

interface AccessoryTypeOption {
  id: string;
  name_tr: string;
  name_en: string | null;
  slug: string;
  category: string;
  neck_finish: string | null;
}

interface DataState {
  accessories: (ProductAccessory & { accessory_type: AccessoryType })[];
  bodyColors: ColorOption[];
  loading: boolean;
}

type DataAction =
  | { type: "LOADING" }
  | { type: "LOADED"; accessories: DataState["accessories"]; bodyColors: ColorOption[] }
  | { type: "ERROR" };

function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case "LOADING":
      return { ...state, loading: true };
    case "LOADED":
      return { accessories: action.accessories, bodyColors: action.bodyColors, loading: false };
    case "ERROR":
      return { ...state, loading: false };
  }
}

export default function ProductAccessoriesPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  const [data, dispatch] = useReducer(dataReducer, {
    accessories: [],
    bodyColors: [],
    loading: true,
  });

  const [accessoryTypes] = useState<AccessoryTypeOption[]>([]);

  // Add accessory form
  const [showAddAcc, setShowAddAcc] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  // Add color form
  const [showAddColor, setShowAddColor] = useState(false);
  const [colorForm, setColorForm] = useState({
    target_type: "product" as "product" | "accessory",
    target_id: id || "",
    color_name_tr: "",
    color_name_en: "",
    color_hex: "#ffffff",
    opacity: 1,
    metallic: 0,
    is_default: false,
  });

  const loadData = async () => {
    if (!id) return;
    dispatch({ type: "LOADING" });
    try {
      const res = await fetch(`/api/configurator/${id}`);
      if (res.ok) {
        const json = await res.json();
        dispatch({
          type: "LOADED",
          accessories: json.accessories || [],
          bodyColors: json.bodyColors || [],
        });
        return;
      }
    } catch {
      // Supabase not configured
    }
    dispatch({ type: "LOADED", accessories: [], bodyColors: [] });
  };

  // Load data on mount
  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive from reducer state
  const { accessories, bodyColors, loading } = data;

  const handleAddAccessory = async () => {
    if (!selectedTypeId || !id) return;
    try {
      const res = await fetch("/api/admin/accessories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: id,
          accessory_type_id: selectedTypeId,
          is_default: isDefault,
          sort_order: sortOrder,
        }),
      });
      if (res.ok) {
        setShowAddAcc(false);
        setSelectedTypeId("");
        setIsDefault(false);
        setSortOrder(0);
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Ekleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  };

  const handleDeleteAccessory = async (accId: string) => {
    if (!confirm("Bu aksesuar eşleştirmesini silmek istediğinize emin misiniz?"))
      return;
    try {
      const res = await fetch(`/api/admin/accessories/${accId}`, {
        method: "DELETE",
      });
      if (res.ok) loadData();
      else alert("Silme başarısız");
    } catch {
      alert("Bağlantı hatası");
    }
  };

  const handleAddColor = async () => {
    try {
      const res = await fetch("/api/admin/colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...colorForm,
          target_id: colorForm.target_type === "product" ? id : colorForm.target_id,
        }),
      });
      if (res.ok) {
        setShowAddColor(false);
        setColorForm({
          target_type: "product",
          target_id: id || "",
          color_name_tr: "",
          color_name_en: "",
          color_hex: "#ffffff",
          opacity: 1,
          metallic: 0,
          is_default: false,
        });
        loadData();
      } else {
        const data = await res.json();
        alert(data.error || "Renk ekleme başarısız");
      }
    } catch {
      alert("Bağlantı hatası");
    }
  };

  const handleDeleteColor = async (colorId: string) => {
    if (!confirm("Bu renk seçeneğini silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/colors/${colorId}`, {
        method: "DELETE",
      });
      if (res.ok) loadData();
      else alert("Silme başarısız");
    } catch {
      alert("Bağlantı hatası");
    }
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg font-medium">Ürün bulunamadı</p>
        <Link href="/admin/products" className="mt-3 text-sm text-primary hover:underline">
          Ürün listesine dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/products/${id}`}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Aksesuar & Renk Yönetimi
          </h1>
          <p className="text-sm text-muted-foreground">{product.name}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
        </div>
      ) : (
        <>
          {/* Accessory Matching Section */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Uyumlu Aksesuarlar
              </h2>
              <button
                onClick={() => setShowAddAcc(!showAddAcc)}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                <Plus size={14} />
                Aksesuar Ekle
              </button>
            </div>

            {/* Add form */}
            {showAddAcc && (
              <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Aksesuar Tipi
                    </label>
                    <select
                      value={selectedTypeId}
                      onChange={(e) => setSelectedTypeId(e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    >
                      <option value="">Seçiniz</option>
                      {accessoryTypes.map((at) => (
                        <option key={at.id} value={at.id}>
                          {at.name_tr} ({at.neck_finish || "-"})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Sıralama
                    </label>
                    <input
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(Number(e.target.value))}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                        className="h-4 w-4 rounded border-border"
                      />
                      Varsayılan
                    </label>
                    <button
                      onClick={handleAddAccessory}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => setShowAddAcc(false)}
                      className="rounded-lg px-2 py-2 text-muted-foreground hover:text-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List */}
            {accessories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Bu ürün için aksesuar tanımlanmamış.
              </p>
            ) : (
              <div className="space-y-2">
                {accessories.map((acc) => (
                  <div
                    key={acc.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        {acc.accessory_type?.category}
                      </span>
                      <span className="text-sm font-medium">
                        {acc.accessory_type?.name_tr}
                      </span>
                      {acc.accessory_type?.neck_finish && (
                        <span className="text-xs text-muted-foreground">
                          {acc.accessory_type.neck_finish}
                        </span>
                      )}
                      {acc.is_default && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          Varsayılan
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteAccessory(acc.id)}
                      className="p-1 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Body Colors Section */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Şişe Renk Seçenekleri
              </h2>
              <button
                onClick={() => {
                  setColorForm((prev) => ({
                    ...prev,
                    target_type: "product",
                    target_id: id || "",
                  }));
                  setShowAddColor(!showAddColor);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                <Plus size={14} />
                Renk Ekle
              </button>
            </div>

            {/* Add color form */}
            {showAddColor && (
              <div className="mb-4 rounded-lg border border-border bg-muted/50 p-4">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Renk Adı (TR) *
                    </label>
                    <input
                      type="text"
                      value={colorForm.color_name_tr}
                      onChange={(e) =>
                        setColorForm((prev) => ({
                          ...prev,
                          color_name_tr: e.target.value,
                        }))
                      }
                      placeholder="Şeffaf"
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      Renk Adı (EN)
                    </label>
                    <input
                      type="text"
                      value={colorForm.color_name_en}
                      onChange={(e) =>
                        setColorForm((prev) => ({
                          ...prev,
                          color_name_en: e.target.value,
                        }))
                      }
                      placeholder="Transparent"
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">
                      HEX Renk *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={colorForm.color_hex}
                        onChange={(e) =>
                          setColorForm((prev) => ({
                            ...prev,
                            color_hex: e.target.value,
                          }))
                        }
                        className="h-9 w-12 cursor-pointer rounded border border-border"
                      />
                      <input
                        type="text"
                        value={colorForm.color_hex}
                        onChange={(e) =>
                          setColorForm((prev) => ({
                            ...prev,
                            color_hex: e.target.value,
                          }))
                        }
                        className="flex-1 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Opaklık
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={colorForm.opacity}
                        onChange={(e) =>
                          setColorForm((prev) => ({
                            ...prev,
                            opacity: Number(e.target.value),
                          }))
                        }
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Metalik
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={1}
                        step={0.1}
                        value={colorForm.metallic}
                        onChange={(e) =>
                          setColorForm((prev) => ({
                            ...prev,
                            metallic: Number(e.target.value),
                          }))
                        }
                        className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={colorForm.is_default}
                      onChange={(e) =>
                        setColorForm((prev) => ({
                          ...prev,
                          is_default: e.target.checked,
                        }))
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                    Varsayılan
                  </label>
                  <button
                    onClick={handleAddColor}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setShowAddColor(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}

            {/* Color list */}
            {bodyColors.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Bu ürün için renk seçeneği tanımlanmamış.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {bodyColors.map((color) => (
                  <div
                    key={color.id}
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2"
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-border"
                      style={{ backgroundColor: color.color_hex }}
                    />
                    <span className="text-sm">{color.color_name_tr}</span>
                    {color.is_default && (
                      <span className="text-[10px] text-primary">
                        (Varsayılan)
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteColor(color.id)}
                      className="ml-1 p-0.5 text-muted-foreground hover:text-destructive"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
