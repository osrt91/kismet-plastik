import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="tr">
      <body>
        <section
          className="flex min-h-screen items-center justify-center px-4"
          style={{ backgroundColor: "#0A1628" }}
        >
          <div className="w-full max-w-md text-center">
            <span
              className="mb-4 inline-block text-[120px] font-black leading-none sm:text-[160px]"
              style={{ color: "#F59E0B" }}
            >
              404
            </span>
            <h1
              className="mb-2 text-2xl font-extrabold sm:text-3xl"
              style={{ color: "#ffffff" }}
            >
              Sayfa Bulunamadı
            </h1>
            <p className="mb-8 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
              Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
            </p>
            <Link
              href="/tr"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: "#F59E0B", color: "#0A1628" }}
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </section>
      </body>
    </html>
  );
}
