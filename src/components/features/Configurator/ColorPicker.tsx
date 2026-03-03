"use client";

import type { ColorOption } from "@/types/configurator";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  colors: ColorOption[];
  selected: ColorOption | null;
  onSelect: (color: ColorOption) => void;
  label: string;
  locale?: string;
}

function getColorName(color: ColorOption, locale: string): string {
  if (locale === "en" && color.color_name_en) return color.color_name_en;
  return color.color_name_tr;
}

export default function ColorPicker({
  colors,
  selected,
  onSelect,
  label,
  locale = "tr",
}: ColorPickerProps) {
  if (colors.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-white/70">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => {
          const isSelected = selected?.id === color.id;
          const isTransparent = color.opacity < 0.5;

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color)}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                isSelected
                  ? "border-amber-500 ring-2 ring-amber-500/30"
                  : "border-white/20 hover:border-white/40"
              )}
              title={getColorName(color, locale)}
            >
              <span
                className={cn(
                  "h-7 w-7 rounded-full",
                  isTransparent && "bg-[repeating-conic-gradient(#666_0%_25%,#444_0%_50%)] bg-[length:6px_6px]"
                )}
                style={{
                  backgroundColor: isTransparent ? undefined : color.color_hex,
                  opacity: isTransparent ? 0.6 : 1,
                }}
              />
              {color.metallic > 0 && (
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="text-xs text-white/50">
          {getColorName(selected, locale)}
          {selected.metallic > 0 && " (Metalik)"}
        </p>
      )}
    </div>
  );
}
