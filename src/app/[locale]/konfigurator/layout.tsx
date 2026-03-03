import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ürün Konfiguratör | Kısmet Plastik",
  description:
    "Şişe rengi seçin, uyumlu kapak veya pompa ekleyin ve ürününüzü özelleştirin. Kısmet Plastik B2B kozmetik ambalaj konfiguratörü.",
};

export default function KonfiguratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
