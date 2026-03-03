import { FOUNDING_YEAR } from "@/lib/company";

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://www.kismetplastik.com",
    name: "Kısmet Plastik Kozmetik Ambalaj ve Kalıp San. Tic. Ltd. Şti.",
    alternateName: "Kısmet Plastik",
    description:
      "Türkiye'nin lider kozmetik ambalaj üreticisi. PET şişe, sprey, kapak ve özel üretim kozmetik ambalaj çözümleri.",
    url: "https://www.kismetplastik.com",
    telephone: "+902125498703",
    email: "bilgi@kismetplastik.com",
    foundingDate: String(FOUNDING_YEAR),
    address: {
      "@type": "PostalAddress",
      streetAddress: "İkitelli OSB Mahallesi İPKAS 4A Blok Sokak No:5",
      addressLocality: "Başakşehir",
      addressRegion: "İstanbul",
      postalCode: "34490",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.0975,
      longitude: 28.7833,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    areaServed: [
      { "@type": "Country", name: "TR" },
      { "@type": "Country", name: "EU" },
      { "@type": "Country", name: "ME" },
    ],
    sameAs: [
      "https://www.kismetplastik.com",
      "https://www.facebook.com/kismetplastik",
      "https://www.instagram.com/kismetplastik",
      "https://www.linkedin.com/company/kismetplastik",
    ],
    priceRange: "$$",
    currenciesAccepted: "TRY, USD, EUR",
    paymentAccepted: "Cash, Bank Transfer",
    image: "https://www.kismetplastik.com/images/logo.jpg",
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Quality Management",
        name: "ISO 9001:2015",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Food Safety",
        name: "ISO 22000",
      },
      {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "Food Safety",
        name: "FSSC 22000",
      },
    ],
    knowsAbout: [
      "PET bottle manufacturing",
      "Cosmetic packaging",
      "Plastic bottle production",
      "Custom mold design",
      "Spray packaging",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kısmet Plastik",
    legalName: "Kısmet Plastik Kozmetik Ambalaj ve Kalıp San. Tic. Ltd. Şti.",
    url: "https://www.kismetplastik.com",
    logo: "https://www.kismetplastik.com/images/logo.jpg",
    foundingDate: String(FOUNDING_YEAR),
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
      maxValue: 200,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+902125498703",
        contactType: "sales",
        availableLanguage: ["Turkish", "English"],
        areaServed: ["TR", "EU", "ME"],
      },
      {
        "@type": "ContactPoint",
        email: "bilgi@kismetplastik.com",
        contactType: "customer service",
        availableLanguage: ["Turkish", "English"],
      },
    ],
    sameAs: [
      "https://www.facebook.com/kismetplastik",
      "https://www.instagram.com/kismetplastik",
      "https://www.linkedin.com/company/kismetplastik",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  category,
  material,
  inStock,
}: {
  name: string;
  description: string;
  category: string;
  material: string;
  inStock: boolean;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    category,
    material,
    brand: {
      "@type": "Brand",
      name: "Kısmet Plastik",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Kısmet Plastik",
    },
    offers: {
      "@type": "Offer",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: "TRY",
      seller: {
        "@type": "Organization",
        name: "Kısmet Plastik",
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
