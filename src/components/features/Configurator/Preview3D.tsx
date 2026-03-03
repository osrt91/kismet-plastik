"use client";

import { cn } from "@/lib/utils";

interface Preview3DProps {
  className?: string;
}

export default function Preview3D({ className }: Preview3DProps) {
  return (
    <div
      className={cn(
        "flex aspect-[3/4] w-full max-w-[400px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#0D0D0D]",
        className
      )}
    >
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
        <p className="text-center text-sm leading-relaxed">
          3D görünüm yakın zamanda
          <br />
          aktif olacak
        </p>
      </div>
    </div>
  );
}
