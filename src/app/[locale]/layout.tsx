import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Instrument_Sans, Noto_Sans_Arabic } from "next/font/google";
import { LocaleProvider } from "@/contexts/LocaleContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const WhatsAppButton = dynamic(() => import("@/components/ui/WhatsAppButton"));
const ScrollToTop = dynamic(() => import("@/components/ui/ScrollToTop"));
const CookieBanner = dynamic(() => import("@/components/ui/CookieBanner"));
const InstallPrompt = dynamic(() => import("@/components/ui/InstallPrompt"));
import { LocalBusinessJsonLd, OrganizationJsonLd } from "@/components/seo/JsonLd";
import { locales } from "@/proxy";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";
  const isAr = locale === "ar";

  const titles: Record<string, string> = {
    tr: "Kısmet Plastik | B2B Kozmetik Ambalaj Çözümleri",
    en: "Kısmet Plastik | B2B Cosmetic Packaging Solutions",
    ar: "كسمت بلاستيك | حلول تعبئة مستحضرات التجميل B2B",
  };

  const descriptions: Record<string, string> = {
    tr: "Kısmet Plastik - Türkiye'nin lider kozmetik ambalaj üreticisi. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri. Toptan satış ve B2B hizmetler.",
    en: "Kısmet Plastik - Turkey's leading cosmetic packaging manufacturer. PET bottles, sprays, caps and custom cosmetic packaging solutions. Wholesale and B2B services.",
    ar: "كسمت بلاستيك - الشركة الرائدة في تركيا لتصنيع تعبئة مستحضرات التجميل. عبوات PET وبخاخات وأغطية وحلول تعبئة مخصصة. خدمات البيع بالجملة وB2B.",
  };

  const keywordsMap: Record<string, string[]> = {
    tr: [
      "kozmetik ambalaj",
      "PET şişe",
      "plastik şişe",
      "ambalaj üreticisi",
      "toptan plastik",
      "B2B plastik",
      "kismet plastik",
      "sprey ambalaj",
      "plastik kapak",
      "özel üretim ambalaj",
    ],
    en: [
      "cosmetic packaging",
      "PET bottle",
      "plastic bottle",
      "packaging manufacturer",
      "wholesale plastic",
      "B2B plastic",
      "kismet plastik",
      "spray packaging",
      "plastic cap",
      "custom packaging",
    ],
    ar: [
      "تعبئة مستحضرات التجميل",
      "عبوات PET",
      "عبوات بلاستيكية",
      "مصنع تعبئة",
      "بلاستيك بالجملة",
      "B2B بلاستيك",
      "كسمت بلاستيك",
      "عبوات رش",
      "أغطية بلاستيكية",
      "تعبئة مخصصة",
    ],
  };

  const ogLocale = isTr ? "tr_TR" : isAr ? "ar_SA" : "en_US";

  return {
    metadataBase: new URL("https://www.kismetplastik.com"),
    title: {
      default: titles[locale] ?? titles.tr,
      template: "%s | Kısmet Plastik",
    },
    description: descriptions[locale] ?? descriptions.tr,
    keywords: keywordsMap[locale] ?? keywordsMap.tr,
    openGraph: {
      title: titles[locale] ?? titles.tr,
      description: descriptions[locale] ?? descriptions.tr,
      type: "website",
      locale: ogLocale,
      siteName: "Kısmet Plastik",
      images: [
        {
          url: "/images/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kısmet Plastik",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] ?? titles.tr,
      images: ["/images/og-image.png"],
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.kismetplastik.com/${locale}`,
      languages: {
        tr: "https://www.kismetplastik.com/tr",
        en: "https://www.kismetplastik.com/en",
        ar: "https://www.kismetplastik.com/ar",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as "tr" | "en" | "ar")) {
    notFound();
  }

  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontClasses = locale === "ar"
    ? `${fraunces.variable} ${instrumentSans.variable} ${notoSansArabic.variable}`
    : `${fraunces.variable} ${instrumentSans.variable}`;

  return (
    <html lang={locale} dir={dir} className={fontClasses}>
      <head>
        <LocalBusinessJsonLd />
        <OrganizationJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js').catch(()=>{})})}`,
          }}
        />
        <link
          rel="preload"
          href="/fonts/MyriadPro-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/MyriadPro-Semibold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {process.env.NEXT_PUBLIC_SUPABASE_URL && (
          <>
            <link rel="preconnect" href={process.env.NEXT_PUBLIC_SUPABASE_URL} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_SUPABASE_URL} />
          </>
        )}
        <link rel="preconnect" href="https://www.google.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="preconnect" href="https://wa.me" />
        <link rel="dns-prefetch" href="https://wa.me" />
        <link rel="preconnect" href="https://maps.googleapis.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#002060" />
        <link rel="apple-touch-icon" sizes="192x192" href="/images/icon-192.png" />
      </head>
      <body className="antialiased">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white shadow-lg transition-transform focus:translate-y-0"
        >
          {locale === "tr" ? "İçeriğe atla" : locale === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
        </a>
        <div className="scroll-progress-bar" />
        <ThemeProvider>
          <LocaleProvider>
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            {/* <AIChatbot /> */}
            <ScrollToTop />
            <InstallPrompt />
            <CookieBanner />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
