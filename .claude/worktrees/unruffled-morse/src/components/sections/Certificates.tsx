"use client";

import { ShieldCheck, Award, Leaf, Lock, FlaskConical, CheckCircle2, Download, ExternalLink } from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";

const certifications = [
  { code: "ISO 9001", full: "ISO 9001:2015", icon: ShieldCheck, color: "from-primary-500 to-primary-600", desc: "Kalite Yönetim Sistemi", pdf: "/sertifikalar/ISO-9001.pdf" },
  { code: "ISO 14001", full: "ISO 14001:2015", icon: Leaf, color: "from-eco-500 to-eco-400", desc: "Çevre Yönetim Sistemi", pdf: "/sertifikalar/ISO-14001.pdf" },
  { code: "ISO 45001", full: "ISO 45001:2018", icon: Award, color: "from-accent-500 to-accent-400", desc: "İş Sağlığı ve Güvenliği", pdf: "/sertifikalar/ISO-45001.pdf" },
  { code: "ISO 10002", full: "ISO 10002:2018", icon: CheckCircle2, color: "from-primary-500 to-accent-500", desc: "Müşteri Memnuniyeti", pdf: "/sertifikalar/ISO-10002.pdf" },
  { code: "ISO/IEC 27001", full: "ISO/IEC 27001", icon: Lock, color: "from-primary-600 to-primary-500", desc: "Bilgi Güvenliği", pdf: "/sertifikalar/ISO-IEC-27001.pdf" },
  { code: "CE", full: "CE Marking", icon: Award, color: "from-accent-400 to-eco-500", desc: "Avrupa Uygunluk İşareti", pdf: "/sertifikalar/CE.pdf" },
];

export default function Certificates() {
  const { dict } = useLocale();
  const h = dict.home;

  return (
    <section className="relative overflow-hidden bg-white py-20 dark:bg-neutral-0 lg:py-28">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 rounded-full bg-primary-500/[0.02] blur-[120px]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-eco-500/[0.02] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6">
        <AnimateOnScroll animation="fade-up">
          <div className="mb-16 text-center">
            <span className="mb-3 inline-block text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
              {h.certsOverline}
            </span>
            <h2 className="mb-4 text-3xl font-extrabold text-primary-900 dark:text-white sm:text-4xl lg:text-5xl">
              {h.certsTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-neutral-600 dark:text-neutral-400">
              {h.certsSubtitle}
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <AnimateOnScroll key={cert.code} animation="fade-up" delay={i * 80}>
                <div className="group relative flex flex-col rounded-2xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:border-primary-500/20 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-0.5 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-primary-500/30">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${cert.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      <Icon size={22} strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-primary-900 dark:text-white">
                          {cert.code}
                        </span>
                        <CheckCircle2 size={14} className="shrink-0 text-eco-500" />
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {cert.full}
                      </div>
                      <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
                        {cert.desc}
                      </div>
                    </div>
                  </div>

                  <a
                    href={cert.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg border border-neutral-200 px-3 py-1.5 text-[11px] font-semibold text-neutral-500 transition-all hover:border-primary-500/30 hover:bg-primary-50 hover:text-primary-600 dark:border-neutral-600 dark:text-neutral-400 dark:hover:border-primary-500/40 dark:hover:bg-primary-500/10 dark:hover:text-primary-300"
                  >
                    <Download size={11} />
                    PDF İndir
                    <ExternalLink size={10} />
                  </a>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        <AnimateOnScroll animation="fade-up" delay={500}>
          <div className="mt-12 rounded-2xl border border-primary-500/10 bg-gradient-to-br from-primary-50 to-white p-8 dark:border-primary-500/20 dark:from-neutral-800 dark:to-neutral-900">
            <div className="flex flex-col items-center gap-6 lg:flex-row">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/20">
                <FlaskConical size={28} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-primary-900 dark:text-white">
                  {h.certsLabTitle}
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {h.certsLabDesc}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <div className="flex flex-col items-center rounded-xl border border-eco-500/20 bg-eco-500/5 px-4 py-3 dark:border-eco-500/30 dark:bg-eco-500/10">
                  <span className="text-2xl font-extrabold text-eco-500">6</span>
                  <span className="text-[10px] font-medium text-eco-500/70">{h.certsCountLabel ?? "Sertifika"}</span>
                </div>
                <div className="flex flex-col items-center rounded-xl border border-primary-500/20 bg-primary-500/5 px-4 py-3 dark:border-primary-500/30 dark:bg-primary-500/10">
                  <span className="text-2xl font-extrabold text-primary-500">100%</span>
                  <span className="text-[10px] font-medium text-primary-500/70">{h.certsComplianceLabel ?? "Uyumluluk"}</span>
                </div>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
