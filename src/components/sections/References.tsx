"use client";

import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const referenceNames = [
  "Farmasi",
  "Hunca",
  "Bioblas",
  "Hobby",
  "Deep Fresh",
  "Morfose",
  "Eyüp Sabri Tuncer",
  "Sleepy",
  "Cotton Bar",
  "Arko",
  "Komili",
  "Duru",
];

const referenceNamesRow2 = [
  "Bingo",
  "ABC Deterjan",
  "Activex",
  "Peros",
  "Domestos",
  "Cif",
  "Tursil",
  "Omo",
  "Fairy",
  "Yumoş",
  "Vernel",
  "Molfix",
];

function MarqueeRow({ names, reverse = false }: { names: string[]; reverse?: boolean }) {
  const doubled = [...names, ...names];
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-neutral-50 to-transparent dark:from-neutral-900 sm:w-32" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-neutral-50 to-transparent dark:from-neutral-900 sm:w-32" />

      <div
        className={`flex items-center gap-6 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
      >
        {doubled.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="group flex h-16 w-44 shrink-0 items-center justify-center gap-3 rounded-xl border border-neutral-200/60 bg-white px-5 shadow-sm transition-all duration-300 hover:border-primary-500/30 hover:shadow-md hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary-50 to-accent-50 text-sm font-extrabold text-primary-500 transition-all group-hover:from-primary-100 group-hover:to-accent-100 dark:from-neutral-700 dark:to-neutral-600 dark:text-primary-300">
              {name.charAt(0)}
            </span>
            <span className="text-[13px] font-bold tracking-wide text-neutral-500 transition-colors group-hover:text-primary-700 dark:text-neutral-400 dark:group-hover:text-primary-300">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function References() {
  const { dict } = useLocale();
  const h = dict.home;

  return (
    <section className="relative overflow-hidden bg-neutral-50 py-20 dark:bg-neutral-900 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.referencesOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl">
              {h.referencesTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-500 dark:text-neutral-400">
              {h.referencesSubtitle}
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      <div className="space-y-5">
        <MarqueeRow names={referenceNames} />
        <MarqueeRow names={referenceNamesRow2} reverse />
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up" delay={300}>
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="rounded-full border border-primary-100 bg-white px-5 py-2 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
              <span className="text-2xl font-extrabold text-primary-500">1000+</span>
              <span className="ml-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">{h.referencesCountLabel ?? "Mutlu Müşteri"}</span>
            </div>
            <div className="rounded-full border border-accent-200 bg-accent-50 px-5 py-2 shadow-sm dark:border-accent-500/30 dark:bg-accent-500/10">
              <span className="text-2xl font-extrabold text-accent-500">25+</span>
              <span className="ml-2 text-sm font-medium text-accent-700 dark:text-accent-400">{h.referencesCountryLabel ?? "İhracat Ülkesi"}</span>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
