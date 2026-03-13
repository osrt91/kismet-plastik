"use client";

import Image from "next/image";
import { useMemo } from "react";
import { useLocale } from "@/contexts/LocaleContext";
import { references as staticReferences } from "@/data/references";
import { cn } from "@/lib/utils";
import type { DbReference } from "@/types/database";

interface ReferenceLogosProps {
  variant: "compact" | "full";
  className?: string;
  references?: DbReference[];
}

interface NormalizedReference {
  id: string;
  name: string;
  logo: string;
  sector: string;
  website?: string;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function LogoCard({
  name,
  logo,
  sector,
  website,
  variant,
}: {
  name: string;
  logo: string;
  sector: string;
  website?: string;
  variant: "compact" | "full";
}) {
  const initials = getInitials(name);

  const content = (
    <div
      className={cn(
        "group relative flex items-center justify-center overflow-hidden rounded-xl border border-neutral-100 bg-white transition-all duration-500 dark:border-neutral-700 dark:bg-neutral-800",
        variant === "compact"
          ? "h-20 w-44 shrink-0 px-4"
          : "h-32 flex-col gap-2 p-6 hover:border-primary-200 hover:shadow-lg dark:hover:border-primary-500/30"
      )}
    >
      {/* Logo image with grayscale filter */}
      <div
        className={cn(
          "relative transition-all duration-500",
          "grayscale group-hover:grayscale-0",
          "opacity-70 group-hover:opacity-100",
          variant === "compact" ? "h-10 w-28" : "h-12 w-36"
        )}
      >
        <Image
          src={logo}
          alt={name}
          fill
          className="object-contain"
          onError={(e) => {
            // Hide the image if it fails to load; initials fallback is always shown behind
            (e.target as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>

      {/* Initials fallback (always present behind the image) */}
      <div
        className={cn(
          "absolute inset-0 -z-10 flex items-center justify-center",
          variant === "compact" ? "flex-row gap-2" : "flex-col gap-1"
        )}
      >
        <span
          className={cn(
            "font-bold text-primary-900/20 transition-colors duration-500 group-hover:text-primary-900/40 dark:text-white/20 dark:group-hover:text-white/40",
            variant === "compact" ? "text-xl" : "text-2xl"
          )}
        >
          {initials}
        </span>
      </div>

      {/* Sector badge (full variant only) */}
      {variant === "full" && (
        <span className="mt-auto text-xs font-medium text-neutral-500 transition-colors group-hover:text-accent-600 dark:text-neutral-400 dark:group-hover:text-accent-400">
          {sector}
        </span>
      )}

      {/* Company name tooltip on hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-primary-900/90 px-3 py-1.5 text-center text-xs font-medium text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
          variant === "full" && "rounded-b-xl"
        )}
      >
        {name}
      </div>
    </div>
  );

  if (website) {
    return (
      <a
        href={website}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
}

function CompactVariant({ refs }: { refs: NormalizedReference[] }) {
  // Duplicate references for seamless marquee loop
  const doubled = [...refs, ...refs];

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-neutral-900" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-neutral-900" />

      {/* Marquee track */}
      <div className="flex animate-[marquee_30s_linear_infinite] gap-6 hover:[animation-play-state:paused]">
        {doubled.map((ref, i) => (
          <LogoCard
            key={`${ref.id}-${i}`}
            name={ref.name}
            logo={ref.logo}
            sector={ref.sector}
            website={ref.website}
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}

function FullVariant({ refs }: { refs: NormalizedReference[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
      {refs.map((ref) => (
        <LogoCard
          key={ref.id}
          name={ref.name}
          logo={ref.logo}
          sector={ref.sector}
          website={ref.website}
          variant="full"
        />
      ))}
    </div>
  );
}

export default function ReferenceLogos({
  variant,
  className,
  references,
}: ReferenceLogosProps) {
  const { locale } = useLocale();

  /* Normalize: DB references take priority, fallback to static data */
  const normalizedRefs: NormalizedReference[] = useMemo(() => {
    if (references && references.length > 0) {
      return references.map((ref) => ({
        id: ref.id,
        name: ref.name,
        logo: ref.logo_url,
        sector: locale === "en" ? ref.sector_en : ref.sector_tr,
        website: ref.website ?? undefined,
      }));
    }
    // Fallback to static data
    return staticReferences.map((ref) => ({
      id: ref.id,
      name: ref.name,
      logo: ref.logo,
      sector: locale === "en" ? ref.sectorEn : ref.sector,
      website: ref.website,
    }));
  }, [references, locale]);

  return (
    <div className={cn(className)}>
      {variant === "compact" ? (
        <CompactVariant refs={normalizedRefs} />
      ) : (
        <FullVariant refs={normalizedRefs} />
      )}
    </div>
  );
}
