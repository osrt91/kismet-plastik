"use client";

import { useState, useMemo } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { getLocalizedFieldSync } from "@/lib/content";
import type { DbFaqItem, DbContentSection } from "@/types/database";

/* ── Hardcoded fallback data (used when DB returns nothing) ── */
const fallbackFaqData = [
  {
    category: "Genel",
    question_tr: "Kısmet Plastik hangi ürünleri üretiyor?",
    question_en: "What products does Kısmet Plastik manufacture?",
    answer_tr:
      "PET şişeler, plastik şişeler, kolonya şişeleri, sprey ambalajlar, oda parfümü şişeleri, sıvı sabun şişeleri, kapaklar ve özel üretim kozmetik ambalaj ürünleri üretmekteyiz. Kozmetik, kişisel bakım ve parfümeri sektörlerine yönelik geniş bir ürün yelpazemiz bulunmaktadır.",
    answer_en:
      "We manufacture PET bottles, plastic bottles, cologne bottles, spray packaging, room fragrance bottles, liquid soap bottles, caps, and custom cosmetic packaging products. We offer a wide product range for the cosmetics, personal care, and perfumery sectors.",
  },
  {
    category: "Genel",
    question_tr: "Hangi sektörlere hizmet veriyorsunuz?",
    question_en: "Which sectors do you serve?",
    answer_tr:
      "Kozmetik, parfümeri, kişisel bakım, temizlik, otelcilik sektörlerine hizmet vermekteyiz. Her sektörün standartlarına uygun ürünler sunuyoruz.",
    answer_en:
      "We serve the cosmetics, perfumery, personal care, cleaning, and hospitality sectors. We offer products compliant with each sector's standards.",
  },
  {
    category: "Sipariş",
    question_tr: "Minimum sipariş miktarı nedir?",
    question_en: "What is the minimum order quantity?",
    answer_tr:
      "Minimum sipariş miktarları ürüne göre değişmektedir. PET ve plastik şişelerde genellikle 5.000-20.000 adet, kapaklarda 20.000-50.000 adet minimum sipariş alıyoruz. Detaylı bilgi için teklif formumuzu doldurabilirsiniz.",
    answer_en:
      "Minimum order quantities vary by product. For PET and plastic bottles, we generally accept a minimum order of 5,000-20,000 units, and for caps 20,000-50,000 units. Please fill out our quote form for details.",
  },
  {
    category: "Sipariş",
    question_tr: "Sipariş süreci nasıl işliyor?",
    question_en: "How does the order process work?",
    answer_tr:
      "Teklif formumuzu doldurmanız veya bizi aramanız yeterlidir. Uzman ekibimiz ihtiyaçlarınızı değerlendirir, size özel bir teklif hazırlar. Onayınızın ardından üretim planlanır ve belirtilen sürede teslimat yapılır.",
    answer_en:
      "Simply fill out our quote form or call us. Our expert team evaluates your needs and prepares a custom offer. After your approval, production is planned and delivery is made within the specified time.",
  },
  {
    category: "Sipariş",
    question_tr: "Teslimat süreleri ne kadardır?",
    question_en: "What are the delivery times?",
    answer_tr:
      "Standart ürünlerde stoktan 3-5 iş günü, özel üretim siparişlerde 15-30 iş günü içinde teslimat yapılmaktadır. Sipariş miktarına ve ürün özelliklerine göre bu süreler değişebilir.",
    answer_en:
      "Standard products are delivered from stock within 3-5 business days, and custom production orders within 15-30 business days. These times may vary depending on order quantity and product specifications.",
  },
  {
    category: "Sipariş",
    question_tr: "Ödeme koşulları nelerdir?",
    question_en: "What are the payment terms?",
    answer_tr:
      "Kurumsal müşterilerimize vadeli ödeme, çek, havale/EFT ve kredi kartı ile ödeme seçenekleri sunmaktayız. Yeni müşterilerimiz için ilk siparişte peşin veya kapıda ödeme şartı uygulanabilir.",
    answer_en:
      "We offer corporate customers deferred payment, check, bank transfer/EFT, and credit card payment options. Cash on delivery or prepayment may apply for new customers' first orders.",
  },
  {
    category: "Ürün",
    question_tr: "Özel tasarım ürün yaptırabilir miyim?",
    question_en: "Can I have custom-designed products made?",
    answer_tr:
      "Evet, markanıza özel kalıp tasarımı ve ürün geliştirme hizmeti sunuyoruz. Kalıp maliyeti ve üretim süreci hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.",
    answer_en:
      "Yes, we offer custom mold design and product development services for your brand. Contact us for detailed information about mold costs and production processes.",
  },
  {
    category: "Ürün",
    question_tr: "Ürünleriniz kozmetik sektörüne uygun mu?",
    question_en: "Are your products suitable for the cosmetics industry?",
    answer_tr:
      "Evet, tüm ürünlerimiz kozmetik sektörü standartlarına uygun olarak üretilmektedir. ISO 9001 kalite yönetim sistemi çerçevesinde üretilen ürünlerimiz için ilgili test raporları ve uygunluk sertifikaları mevcuttur.",
    answer_en:
      "Yes, all our products are manufactured in compliance with cosmetics industry standards. Relevant test reports and conformity certificates are available for our products produced within the ISO 9001 quality management framework.",
  },
  {
    category: "Ürün",
    question_tr: "Ürünleriniz geri dönüştürülebilir mi?",
    question_en: "Are your products recyclable?",
    answer_tr:
      "PET (Polietilen Tereftalat) %100 geri dönüştürülebilir bir malzemedir. Tüm ürünlerimiz geri dönüşüm kodlamasına sahiptir ve çevreye duyarlı üretim anlayışımızla sürdürülebilirliğe katkıda bulunuyoruz.",
    answer_en:
      "PET (Polyethylene Terephthalate) is 100% recyclable material. All our products have recycling coding and we contribute to sustainability with our environmentally conscious production approach.",
  },
  {
    category: "Kalite",
    question_tr: "Hangi kalite sertifikalarına sahipsiniz?",
    question_en: "Which quality certifications do you hold?",
    answer_tr:
      "ISO 9001 (Kalite Yönetimi), ISO 14001 (Çevre Yönetimi), ISO 45001 (İSG), ISO 10002 (Müşteri Memnuniyeti), ISO/IEC 27001 (Bilgi Güvenliği) ve CE sertifikalarına sahibiz.",
    answer_en:
      "We hold ISO 9001 (Quality Management), ISO 14001 (Environmental Management), ISO 45001 (OHS), ISO 10002 (Customer Satisfaction), ISO/IEC 27001 (Information Security) and CE certifications.",
  },
  {
    category: "Kalite",
    question_tr: "Kalite kontrol süreciniz nasıldır?",
    question_en: "What is your quality control process?",
    answer_tr:
      "4 aşamalı kalite kontrol sürecimiz: Hammadde kontrolü, üretim süreç kontrolü, ürün testleri ve son kontrol & sevkiyat aşamalarından oluşur. Modern laboratuvarımızda boyutsal ölçüm, basınç dayanım, sızdırmazlık ve kozmetik uygunluk testleri yapılmaktadır.",
    answer_en:
      "Our 4-stage quality control process consists of: raw material inspection, production process control, product testing, and final inspection & shipment. Dimensional measurement, pressure resistance, leak testing, and cosmetic compliance tests are conducted in our modern laboratory.",
  },
  {
    category: "Bayi",
    question_tr: "Bayi olmak için ne gerekiyor?",
    question_en: "What is required to become a dealer?",
    answer_tr:
      "Bayilik başvurusu için ticaret sicil belgesi, vergi levhası ve firma bilgileriniz ile bize başvurmanız yeterlidir. Değerlendirme sonucunda bölgesel bayilik veya yetkili satıcılık sözleşmesi yapılmaktadır.",
    answer_en:
      "Simply apply with your trade registry certificate, tax plate, and company information. After evaluation, a regional dealership or authorized reseller agreement is established.",
  },
];

interface SSSClientProps {
  faqItems?: DbFaqItem[];
  content?: Record<string, DbContentSection>;
}

export default function SSSClient({ faqItems, content }: SSSClientProps) {
  const { dict, locale } = useLocale();
  const f = dict.faq;
  const nav = dict.nav;

  /* ── Normalize FAQ items: DB items take priority, fallback if empty ── */
  const normalizedFaq = useMemo(() => {
    if (faqItems && faqItems.length > 0) {
      return faqItems.map((item) => ({
        question: getLocalizedFieldSync(item, "question", locale),
        answer: getLocalizedFieldSync(item, "answer", locale),
        category: item.category ?? (locale === "en" ? "General" : "Genel"),
      }));
    }
    // Fallback to hardcoded data
    return fallbackFaqData.map((item) => ({
      question: locale === "en" ? item.question_en : item.question_tr,
      answer: locale === "en" ? item.answer_en : item.answer_tr,
      category: item.category,
    }));
  }, [faqItems, locale]);

  const categories = useMemo(
    () => [...new Set(normalizedFaq.map((f) => f.category))],
    [normalizedFaq]
  );

  const [activeCategory, setActiveCategory] = useState(categories[0] ?? "");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");

  /* ── Hero text from DB content or dict ── */
  const heroTitle = content?.faq_hero
    ? getLocalizedFieldSync(content.faq_hero, "title", locale) || f.heroTitle
    : f.heroTitle;
  const heroSubtitle = content?.faq_hero
    ? getLocalizedFieldSync(content.faq_hero, "subtitle", locale) || f.heroSubtitle
    : f.heroSubtitle;

  const searchFiltered = searchQuery.trim()
    ? normalizedFaq.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedFaq;

  const filteredFAQ = searchFiltered.filter(
    (faq) => faq.category === activeCategory
  );

  const getCategoryCount = (cat: string) =>
    searchFiltered.filter((faq) => faq.category === cat).length;

  const searchPlaceholder =
    locale === "en"
      ? "Search questions or answers..."
      : "Soru veya cevaplarda ara...";

  const noResultTitle =
    locale === "en" ? "No results found" : "Sonuç bulunamadı";
  const noResultDesc =
    locale === "en"
      ? "Try changing your search criteria or selecting another category."
      : "Arama kriterlerinizi değiştirmeyi veya başka bir kategori seçmeyi deneyin.";

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: normalizedFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="bg-[#FAFAF7] dark:bg-[#0A1628]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
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
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{heroTitle}</span>
            </nav>
            <h1 className="mb-3 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              {heroTitle}
            </h1>
            <div className="mt-4 mb-6 h-1 w-20 rounded-full bg-[#F59E0B]" />
            <p className="max-w-2xl text-lg text-white/70">{heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-12 lg:px-6 lg:py-20">
        {/* Search Input */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mb-8">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpenIndex(0);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-[#0A1628]/10 dark:border-white/10 bg-white dark:bg-white/5 py-3.5 pl-11 pr-4 text-sm text-neutral-700 dark:text-neutral-300 outline-none transition-all placeholder:text-neutral-400 focus:border-[#F59E0B]/50 focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-[#F59E0B]/10"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setOpenIndex(0);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600"
              >
                ✕
              </button>
            )}
          </div>
        </AnimateOnScroll>

        {/* Category Tabs */}
        <AnimateOnScroll animation="fade-up">
          <div className="mb-10 flex flex-wrap gap-2">
            {categories.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    setOpenIndex(0);
                  }}
                  className={`relative rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-[#0A1628] text-white shadow-md"
                      : "bg-white dark:bg-white/5 border border-[#0A1628]/5 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-[#F59E0B]/20 hover:bg-[#F59E0B]/5"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {cat}
                    <span
                      className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                        isActive
                          ? "bg-[#F59E0B]/20 text-[#F59E0B]"
                          : "bg-[#0A1628]/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-[#F59E0B]" />
                  )}
                </button>
              );
            })}
          </div>
        </AnimateOnScroll>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFAQ.length === 0 && (
            <AnimateOnScroll animation="fade-up">
              <div className="flex flex-col items-center justify-center rounded-xl border border-[#0A1628]/5 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-12 text-center">
                <Search size={32} className="mb-3 text-[#F59E0B]/40" />
                <p className="font-semibold text-neutral-500 dark:text-neutral-400">
                  {noResultTitle}
                </p>
                <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
                  {noResultDesc}
                </p>
              </div>
            </AnimateOnScroll>
          )}

          {filteredFAQ.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <AnimateOnScroll
                key={faq.question}
                animation="fade-up"
                delay={i * 60}
              >
                <div
                  className={`overflow-hidden rounded-xl border bg-white dark:bg-white/5 transition-all duration-300 ${
                    isOpen
                      ? "border-[#F59E0B]/30 dark:border-[#F59E0B]/20 shadow-lg shadow-[#F59E0B]/5"
                      : "border-[#0A1628]/5 dark:border-white/10 hover:border-[#0A1628]/10 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className={`flex w-full items-center justify-between px-6 py-5 text-left transition-colors duration-200 ${
                      isOpen ? "bg-[#0A1628]/[0.02] dark:bg-white/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle
                        size={20}
                        className={`shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "scale-110 text-[#F59E0B]"
                            : "text-neutral-400"
                        }`}
                      />
                      <span className="font-semibold text-[#0A1628] dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-all duration-300 ease-out ${
                        isOpen
                          ? "rotate-180 text-[#F59E0B]"
                          : "text-neutral-400"
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#0A1628]/5 dark:border-white/5 px-6 py-5">
                        <div className="border-l-4 border-l-[#F59E0B] pl-4">
                          <p className="leading-relaxed text-neutral-600 dark:text-neutral-300">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* Contact CTA */}
        <AnimateOnScroll animation="fade-up">
          <div className="relative mt-16 overflow-hidden rounded-2xl bg-[#0A1628]/[0.03] dark:bg-white/5 border border-[#0A1628]/5 dark:border-white/10 p-8 text-center lg:p-12">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#0A1628]/5 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#F59E0B]/10 blur-2xl" />
            <div className="absolute right-12 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-[#0A1628]/5 animate-pulse" />
            <div className="absolute bottom-8 left-16 h-10 w-10 rounded-full bg-[#F59E0B]/10 animate-pulse [animation-delay:1s]" />
            <div className="absolute left-1/3 top-6 h-6 w-6 rotate-45 rounded-sm bg-[#0A1628]/5 animate-pulse [animation-delay:2s]" />

            <div className="relative z-10">
              <HelpCircle size={40} className="mx-auto mb-4 text-[#F59E0B]" />
              <h3 className="mb-3 text-xl font-bold text-[#0A1628] dark:text-white">
                {f.notFound}
              </h3>
              <p className="mb-6 text-neutral-600 dark:text-neutral-300">{f.notFoundDesc}</p>
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/iletisim"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1628] px-6 py-3.5 font-bold text-white transition-all duration-300 hover:bg-[#0f2240] hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <MessageCircle size={18} />
                  {f.writeUs}
                </Link>
                <a
                  href="tel:+902125498703"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#0A1628] px-6 py-3.5 font-semibold text-[#0A1628] transition-all duration-300 hover:bg-[#0A1628] hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-[#0A1628]"
                >
                  <Phone size={18} />
                  {f.callUs}
                </a>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
