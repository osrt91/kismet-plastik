"use client";

import { useState, useTransition } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { forgotPasswordAction } from "./actions";

export default function SifremiUnuttumPage() {
  const { dict } = useLocale();
  const nav = dict.nav;
  const d = dict.auth || {};

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await forgotPasswordAction(formData);
      if (result.success) {
        setSuccess(true);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <section className="bg-cream-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <Link href="/bayi-girisi" className="transition-colors hover:text-white">
                {nav.dealer}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{d.forgotPasswordTitle || "Şifremi Unuttum"}</span>
            </nav>
            <h1 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl">
              {d.forgotPasswordTitle || "Şifremi Unuttum"}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {d.forgotPasswordSubtitle || "E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz."}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-md px-4 py-16 lg:py-24">
        <AnimateOnScroll animation="fade-up">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            {success ? (
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h2 className="mb-3 font-display text-xl font-bold text-navy-900">
                  {d.forgotPasswordSent || "E-posta Gönderildi!"}
                </h2>
                <p className="mb-6 text-sm text-neutral-600">
                  {d.forgotPasswordSentDesc || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin."}
                </p>
                <Link
                  href="/bayi-girisi"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-navy-800"
                >
                  <ArrowLeft size={16} />
                  {d.backToLogin || "Giriş Sayfasına Dön"}
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-lg">
                    <KeyRound size={28} className="text-white" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-navy-900">
                    {d.forgotPasswordTitle || "Şifre Sıfırlama"}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {d.forgotPasswordDesc || "Kayıtlı e-posta adresinizi girin, size bir sıfırlama bağlantısı gönderelim."}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                      {d.fieldEmail || "E-posta Adresi"}
                    </label>
                    <div className="group relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                        placeholder="bayi@firma.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="group w-full rounded-xl bg-amber-500 py-3.5 font-bold text-navy-900 shadow-md transition-all hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2">
                      {isPending ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
                      ) : (
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      )}
                      {isPending
                        ? (d.sending || "Gönderiliyor...")
                        : (d.sendResetLink || "Sıfırlama Bağlantısı Gönder")}
                    </span>
                  </button>
                </form>

                <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                  <Link
                    href="/bayi-girisi"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 transition-colors hover:text-navy-900"
                  >
                    <ArrowLeft size={14} />
                    {d.backToLogin || "Giriş Sayfasına Dön"}
                  </Link>
                </div>
              </>
            )}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
