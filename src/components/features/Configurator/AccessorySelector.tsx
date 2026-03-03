"use client";

import type { ProductAccessory, AccessoryType } from "@/types/configurator";
import { cn } from "@/lib/utils";

interface AccessorySelectorProps {
  accessories: ProductAccessory[];
  selected: ProductAccessory | null;
  onSelect: (accessory: ProductAccessory) => void;
  locale?: string;
  labels: {
    compatibleCaps: string;
    compatiblePumps: string;
    compatibleSprays: string;
    noAccessories: string;
  };
}

function getAccessoryName(acc: AccessoryType, locale: string): string {
  if (locale === "en" && acc.name_en) return acc.name_en;
  return acc.name_tr;
}

function groupByCategory(accessories: ProductAccessory[]) {
  const groups: Record<string, ProductAccessory[]> = {};
  for (const acc of accessories) {
    const cat = acc.accessory_type?.category || "other";
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(acc);
  }
  return groups;
}

const categoryLabels: Record<string, { labelKey: keyof AccessorySelectorProps["labels"] }> = {
  cap: { labelKey: "compatibleCaps" },
  pump: { labelKey: "compatiblePumps" },
  spray: { labelKey: "compatibleSprays" },
};

export default function AccessorySelector({
  accessories,
  selected,
  onSelect,
  locale = "tr",
  labels,
}: AccessorySelectorProps) {
  if (accessories.length === 0) {
    return (
      <p className="text-sm text-white/40">{labels.noAccessories}</p>
    );
  }

  const grouped = groupByCategory(accessories);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, items]) => {
        const catConfig = categoryLabels[category];
        const title = catConfig
          ? labels[catConfig.labelKey]
          : category.charAt(0).toUpperCase() + category.slice(1);

        return (
          <div key={category} className="space-y-2">
            <h4 className="text-xs font-medium uppercase tracking-wider text-white/50">
              {title}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {items
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((acc) => {
                  const accType = acc.accessory_type;
                  if (!accType) return null;

                  const isSelected = selected?.id === acc.id;

                  return (
                    <button
                      key={acc.id}
                      onClick={() => onSelect(acc)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                        isSelected
                          ? "border-amber-500 bg-amber-500/10 text-white"
                          : "border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10"
                      )}
                    >
                      {accType.thumbnail_url ? (
                        <img
                          src={accType.thumbnail_url}
                          alt={getAccessoryName(accType, locale)}
                          className="h-12 w-12 object-contain"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-xs text-white/30">
                          {category === "cap" ? "⬢" : category === "pump" ? "↕" : "⊙"}
                        </div>
                      )}
                      <span className="text-xs leading-tight">
                        {getAccessoryName(accType, locale)}
                      </span>
                      {accType.neck_finish && (
                        <span className="text-[10px] text-white/30">
                          {accType.neck_finish}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
