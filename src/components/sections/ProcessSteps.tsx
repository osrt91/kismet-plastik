"use client";

import { Phone, PenTool, Factory, Truck, ArrowRight } from "lucide-react";
import Link from "@/components/ui/LocaleLink";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const stepIcons = [Phone, PenTool, Factory, Truck];
const stepColors = [
  { bg: "from-primary-500 to-primary-600", ring: "ring-primary-500/20" },
  { bg: "from-accent-500 to-accent-400", ring: "ring-accent-500/20" },
  { bg: "from-eco-500 to-eco-400", ring: "ring-eco-500/20" },
  { bg: "from-primary-600 to-primary-500", ring: "ring-primary-500/20" },
];

export default function ProcessSteps() {
  const { dict } = useLocale();
  const h = dict.home;

  const steps = [
    { title: h.processStep1, desc: h.processStep1Desc },
    { title: h.processStep2, desc: h.processStep2Desc },
    { title: h.processStep3, desc: h.processStep3Desc },
    { title: h.processStep4, desc: h.processStep4Desc },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-neutral-0 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary-500/[0.03] blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-accent-500/[0.03] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.processOverlineHome}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
              {h.processTitleHome}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {h.processSubtitleHome}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {/* Desktop connector */}
          <div className="absolute top-[52px] left-[12%] right-[12%] hidden h-[2px] lg:block">
            <div className="h-full w-full bg-gradient-to-r from-primary-500/10 via-primary-500/20 to-primary-500/10" />
            <div className="absolute inset-0 h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-40" style={{ maskImage: "linear-gradient(90deg, transparent, white 20%, white 80%, transparent)" }} />
          </div>

          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            const colors = stepColors[i];
            return (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 120}>
                <div className="group relative flex flex-col items-center text-center lg:px-4">
                  {/* Mobile connector */}
                  {i > 0 && (
                    <div className="absolute -top-3 left-1/2 h-6 w-px bg-gradient-to-b from-primary-500/20 to-primary-500/40 sm:hidden" />
                  )}

                  <div className={`relative z-10 mb-6 flex h-[76px] w-[76px] items-center justify-center rounded-2xl bg-gradient-to-br ${colors.bg} text-white shadow-lg ring-4 ${colors.ring} transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1.5 group-hover:scale-105`}>
                    <Icon size={30} strokeWidth={1.5} />
                    <span className="absolute -top-2.5 -right-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-primary-900 shadow-md ring-2 ring-primary-100 dark:bg-neutral-0 dark:text-white dark:ring-neutral-700">
                      {i + 1}
                    </span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold text-primary-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="max-w-[220px] text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {step.desc}
                  </p>

                  {i < steps.length - 1 && (
                    <ArrowRight size={16} className="mt-4 hidden text-primary-300 dark:text-primary-600 lg:block" />
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll animation="fade-up" delay={600}>
          <div className="mt-14 flex justify-center">
            <Link
              href="/teklif-al"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-400 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-accent-500/20 transition-all hover:shadow-xl hover:shadow-accent-500/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              {h.processCtaHome ?? "Hemen Teklif Alın"}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
