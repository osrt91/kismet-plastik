"use client";

import { useState, useMemo } from "react";
import Link from "@/components/ui/LocaleLink";
import { ChevronRight, Search, BookOpen } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { getLocalizedFieldSync } from "@/lib/content";
import type { GlossaryTerm, DbContentSection } from "@/types/database";

interface GlossaryClientProps {
  terms?: GlossaryTerm[];
  content?: Record<string, DbContentSection>;
}

export default function GlossaryClient({ terms, content }: GlossaryClientProps) {
  const { locale } = useLocale();
  const isTr = locale === "tr";

  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  /* Hero text from DB content or fallback */
  const heroTitle = content?.glossary_hero
    ? getLocalizedFieldSync(content.glossary_hero, "title", locale) ||
      (isTr ? "Ambalaj Sözlüğü" : "Packaging Glossary")
    : isTr
      ? "Ambalaj Sözlüğü"
      : "Packaging Glossary";

  const heroSubtitle = content?.glossary_hero
    ? getLocalizedFieldSync(content.glossary_hero, "subtitle", locale) ||
      (isTr
        ? "Ambalaj sektöründe kullanılan terimler ve tanımlar."
        : "Terms and definitions used in the packaging industry.")
    : isTr
      ? "Ambalaj sektöründe kullanılan terimler ve tanımlar."
      : "Terms and definitions used in the packaging industry.";

  /* Normalize terms */
  const normalizedTerms = useMemo(() => {
    if (!terms || terms.length === 0) return [];
    return terms.map((t) => ({
      id: t.id,
      term: getLocalizedFieldSync(t, "term", locale),
      definition: getLocalizedFieldSync(t, "definition", locale),
      letter: t.letter.toUpperCase(),
    }));
  }, [terms, locale]);

  /* Get available letters from terms */
  const availableLetters = useMemo(() => {
    const letters = new Set(normalizedTerms.map((t) => t.letter));
    return Array.from(letters).sort();
  }, [normalizedTerms]);

  /* All Turkish alphabet letters for the tab bar */
  const allLetters = "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");

  /* Filter terms */
  const filteredTerms = useMemo(() => {
    let filtered = normalizedTerms;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }

    if (activeLetter) {
      filtered = filtered.filter((t) => t.letter === activeLetter);
    }

    return filtered;
  }, [normalizedTerms, searchQuery, activeLetter]);

  /* Group filtered terms by letter */
  const groupedTerms = useMemo(() => {
    const groups: Record<string, typeof filteredTerms> = {};
    for (const term of filteredTerms) {
      if (!groups[term.letter]) groups[term.letter] = [];
      groups[term.letter].push(term);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b, "tr"));
  }, [filteredTerms]);

  const searchPlaceholder = isTr ? "Terim veya tanım ara..." : "Search terms or definitions...";
  const allLabel = isTr ? "Tümü" : "All";

  return (
    <section className="bg-[#FAFAF7] dark:bg-[#0A1628]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0f2240] to-[#0A1628] py-16 lg:py-20">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="hover:text-white transition-colors">
                {isTr ? "Ana Sayfa" : "Home"}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{heroTitle}</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <BookOpen size={32} className="text-[#F59E0B]" />
              <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                {heroTitle}
              </h1>
            </div>
            <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
            <p className="max-w-2xl text-lg text-white/70">{heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Search */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-8">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-[#0A1628]/10 dark:border-white/10 bg-white dark:bg-white/5 py-3.5 pl-11 pr-4 text-sm text-neutral-700 dark:text-neutral-300 outline-none transition-all placeholder:text-neutral-400 focus:border-[#F59E0B]/50 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-[#F59E0B]/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
          </div>
        </AnimateOnScroll>

        {/* Letter tabs */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveLetter(null)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                activeLetter === null
                  ? "bg-[#0A1628] text-white shadow-md"
                  : "bg-white dark:bg-white/5 border border-[#0A1628]/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-[#F59E0B]/20 hover:bg-[#F59E0B]/5"
              }`}
            >
              {allLabel}
            </button>
            {allLetters.map((letter) => {
              const isAvailable = availableLetters.includes(letter);
              const isActive = activeLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => isAvailable && setActiveLetter(letter)}
                  disabled={!isAvailable}
                  className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#0A1628] text-white shadow-md"
                      : isAvailable
                        ? "bg-white dark:bg-white/5 border border-[#0A1628]/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-[#F59E0B]/20 hover:bg-[#F59E0B]/5"
                        : "bg-neutral-50 dark:bg-white/[0.02] border border-transparent text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </AnimateOnScroll>

        {/* Terms */}
        {normalizedTerms.length === 0 ? (
          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#0A1628]/5 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-16 text-center">
              <BookOpen size={40} className="mb-4 text-[#F59E0B]/40" />
              <p className="font-semibold text-neutral-500 dark:text-neutral-400">
                {isTr ? "Sözlük henüz hazırlanıyor." : "Glossary is being prepared."}
              </p>
              <p className="mt-2 text-sm text-neutral-400 dark:text-neutral-500">
                {isTr
                  ? "Yakında ambalaj sektörüne dair terimler burada yer alacak."
                  : "Terms related to the packaging industry will be available here soon."}
              </p>
            </div>
          </AnimateOnScroll>
        ) : filteredTerms.length === 0 ? (
          <AnimateOnScroll animation="fade-up">
            <div className="flex flex-col items-center justify-center rounded-xl border border-[#0A1628]/5 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-12 text-center">
              <Search size={32} className="mb-3 text-[#F59E0B]/40" />
              <p className="font-semibold text-neutral-500 dark:text-neutral-400">
                {isTr ? "Sonuç bulunamadı" : "No results found"}
              </p>
              <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                {isTr
                  ? "Arama kriterlerinizi değiştirmeyi veya başka bir harf seçmeyi deneyin."
                  : "Try changing your search criteria or selecting another letter."}
              </p>
            </div>
          </AnimateOnScroll>
        ) : (
          <div className="space-y-10">
            {groupedTerms.map(([letter, letterTerms]) => (
              <div key={letter}>
                {/* Letter header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0A1628] text-lg font-bold text-white dark:bg-[#F59E0B] dark:text-[#0A1628]">
                    {letter}
                  </span>
                  <div className="h-px flex-1 bg-[#0A1628]/10 dark:bg-white/10" />
                  <span className="text-xs font-medium text-neutral-400">
                    {letterTerms.length} {isTr ? "terim" : "term"}
                    {letterTerms.length > 1 && !isTr ? "s" : ""}
                  </span>
                </div>

                {/* Term cards */}
                <div className="space-y-3">
                  {letterTerms.map((term, i) => (
                    <AnimateOnScroll
                      key={term.id}
                      animation="fade-up"
                      delay={i * 40}
                    >
                      <div className="rounded-xl border border-[#0A1628]/5 dark:border-white/10 bg-white dark:bg-white/5 p-5 transition-all duration-200 hover:border-[#F59E0B]/20 hover:shadow-md">
                        <h3 className="mb-2 text-base font-bold text-[#0A1628] dark:text-white">
                          {term.term}
                        </h3>
                        <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                          {term.definition}
                        </p>
                      </div>
                    </AnimateOnScroll>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats footer */}
        {normalizedTerms.length > 0 && (
          <AnimateOnScroll animation="fade-up">
            <div className="mt-16 rounded-2xl bg-[#0A1628]/[0.03] dark:bg-white/5 border border-[#0A1628]/5 dark:border-white/10 p-6 text-center">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {isTr
                  ? `Sözlükte toplam ${normalizedTerms.length} terim bulunmaktadır.`
                  : `The glossary contains ${normalizedTerms.length} terms in total.`}
              </p>
            </div>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  );
}
