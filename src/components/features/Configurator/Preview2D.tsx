"use client";

import { useRef, useCallback } from "react";
import type { ColorOption } from "@/types/configurator";
import { cn } from "@/lib/utils";

interface Preview2DProps {
  productSlug: string | null;
  bodyColor: ColorOption | null;
  accessorySlug: string | null;
  accessoryColor: ColorOption | null;
  className?: string;
}

/**
 * CSS filter mapping for color transforms on product/accessory images.
 * The base images should be white/transparent PET bottles.
 */
function getColorFilter(color: ColorOption | null): string {
  if (!color) return "none";

  const hex = color.color_hex.toLowerCase();

  // Special cases
  if (hex === "#ffffff" || hex === "#f5f5f5") {
    return "brightness(2) saturate(0)";
  }
  if (hex === "#333333" || hex === "#000000" || hex === "#1a1a1a") {
    return "brightness(0.1) saturate(0)";
  }

  // Calculate hue from hex
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta) % 6;
    else if (max === g) hue = (b - r) / delta + 2;
    else hue = (r - g) / delta + 4;
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
  }

  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  const saturateVal = Math.max(0.8, saturation * 2);
  const brightnessVal = 0.5 + lightness * 0.6;

  return `hue-rotate(${hue}deg) saturate(${saturateVal.toFixed(1)}) brightness(${brightnessVal.toFixed(1)})`;
}

function getOpacityStyle(color: ColorOption | null): number {
  if (!color) return 1;
  // Transparent look
  if (color.opacity < 0.5) return 0.4;
  return color.opacity;
}

export default function Preview2D({
  productSlug,
  bodyColor,
  accessorySlug,
  accessoryColor,
  className,
}: Preview2DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (!containerRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, 600, 800);

    // Load and draw product image
    if (productSlug) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `/configurator/products/${productSlug}-front.png`;
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
        ctx.drawImage(img, 50, 50, 500, 700);
      } catch {
        // Image not found, draw placeholder
      }
    }

    const link = document.createElement("a");
    link.download = `konfigurasyon-${productSlug || "urun"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [productSlug]);

  const productFilter = getColorFilter(bodyColor);
  const productOpacity = getOpacityStyle(bodyColor);
  const accFilter = getColorFilter(accessoryColor);
  const accOpacity = getOpacityStyle(accessoryColor);

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {/* Preview container */}
      <div
        ref={containerRef}
        className="relative flex aspect-[3/4] w-full max-w-[400px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D0D]"
      >
        {productSlug ? (
          <>
            {/* Bottle body layer */}
            <img
              src={`/configurator/products/${productSlug}-front.png`}
              alt="Product preview"
              className="absolute inset-0 h-full w-full object-contain p-8"
              style={{
                filter: productFilter,
                opacity: productOpacity,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />

            {/* Accessory overlay layer */}
            {accessorySlug && (
              <img
                src={`/configurator/accessories/${accessorySlug}-front.png`}
                alt="Accessory preview"
                className="absolute inset-x-0 top-0 h-full w-full object-contain p-8"
                style={{
                  filter: accFilter,
                  opacity: accOpacity,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 text-white/40">
            <svg
              width="64"
              height="64"
              viewBox="0 0 80 144"
              fill="none"
              className="opacity-30"
            >
              <rect x="30" y="2" width="20" height="12" rx="2" fill="currentColor" opacity="0.4" />
              <path
                d="M32 20 C32 20 24 35 24 45 L24 130 C24 136 30 140 40 140 C50 140 56 136 56 130 L56 45 C56 35 48 20 48 20 Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            <span className="text-sm">Ürün seçin</span>
          </div>
        )}
      </div>

      {/* Download button */}
      {productSlug && (
        <button
          onClick={handleDownload}
          className="mt-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          PNG İndir
        </button>
      )}
    </div>
  );
}
