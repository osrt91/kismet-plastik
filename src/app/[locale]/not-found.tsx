"use client";

import Link from "@/components/ui/LocaleLink";
import { useLocale } from "@/contexts/LocaleContext";
import { Home, Search, ArrowRight, Package, Phone, Mail } from "lucide-react";

export default function NotFound() {
  const { locale, dict } = useLocale();
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[#0A1628] px-4 py-16">
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(245,158,11,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          animation: "dot-drift 25s linear infinite",
        }}
      />

      {/* Decorations */}
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-44 w-44 rounded-full bg-amber-500/10"
        style={{ animation: "float 6s ease-in-out infinite" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-16 h-60 w-60 rounded-full border-[3px] border-amber-500/15"
        style={{ animation: "float 8s ease-in-out infinite 1s" }}
      />
      <div
        className="pointer-events-none absolute right-[20%] top-12 hidden h-10 w-10 rounded-full bg-amber-400/10 sm:block"
        style={{ animation: "float 5s ease-in-out infinite 0.5s" }}
      />
      <div
        className="pointer-events-none absolute bottom-24 left-20 hidden h-10 w-10 bg-amber-400/10 sm:block"
        style={{
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          animation: "float 6s ease-in-out infinite 1.5s",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="mb-4">
          <span
            className="inline-block text-[120px] font-black leading-none text-amber-500 sm:text-[160px]"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            404
          </span>
        </div>

        <h1 className="mb-2 text-2xl font-extrabold text-white sm:text-3xl">
          {dict.notFound.title}
        </h1>
        <p className="mb-1.5 text-base font-semibold text-amber-400 sm:text-lg">
          {dict.notFound.subtitle}
        </p>
        <p className="mx-auto mb-8 max-w-md text-sm text-white/50 sm:text-base">
          {dict.notFound.description}
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 font-bold text-[#0A1628] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-400 hover:shadow-xl"
          >
            <Home size={18} />
            {dict.common.backToHome}
          </Link>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-white/20 px-6 py-3.5 font-semibold text-white transition-all duration-200 hover:border-white/40 hover:bg-white/10"
          >
            <Package size={18} />
            {dict.home.ctaProducts}
          </Link>
        </div>

        <form
          action={`/${locale}/urunler`}
          className="mx-auto mt-8 flex max-w-sm items-center gap-2"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              name="q"
              placeholder={dict.notFound.searchPlaceholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white shadow-sm outline-none transition-all placeholder:text-white/30 focus:border-amber-500/40 focus:ring-2 focus:ring-amber-500/20"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/20"
          >
            {dict.common.search}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { name: dict.nav.about, href: "/hakkimizda" },
            { name: dict.nav.contact, href: "/iletisim" },
            { name: dict.nav.quote, href: "/teklif-al" },
            { name: dict.nav.faq, href: "/sss" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/60 transition-all duration-200 hover:scale-105 hover:border-amber-500/30 hover:bg-white/10 hover:text-white"
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-white/30 sm:flex-row">
          <a href="tel:+902125498703" className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-400">
            <Phone size={14} />
            0212 549 87 03
          </a>
          <span className="hidden sm:inline">|</span>
          <a href="mailto:bilgi@kismetplastik.com" className="inline-flex items-center gap-1.5 transition-colors hover:text-amber-400">
            <Mail size={14} />
            bilgi@kismetplastik.com
          </a>
        </div>
      </div>
    </section>
  );
}
