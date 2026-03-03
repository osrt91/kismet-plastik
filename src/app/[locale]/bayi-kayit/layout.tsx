import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bayi Kayıt",
  description:
    "Kısmet Plastik bayilik başvurusu. Firma bilgilerinizi girerek B2B platformumuza kayıt olun ve özel fiyat avantajlarından yararlanın.",
  openGraph: {
    title: "Bayi Kayıt | Kısmet Plastik",
    description: "Bayilik başvurusu yaparak özel avantajlardan yararlanın.",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
