"use client";

import { useState, useTransition } from "react";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Building2,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  Shield,
  TrendingUp,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { registerAction } from "./actions";

const sectors = [
  "Kozmetik",
  "İlaç",
  "Gıda",
  "Kimya",
  "Temizlik",
  "Tarım",
  "Diğer",
];

export default function BayiKayitPage() {
  const { dict } = useLocale();
  const nav = dict.nav;
  const d = dict.auth?.register || {};

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await registerAction(formData);

      if (result.success) {
        setSuccess(true);
      } else if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  const getFieldError = (field: string) => {
    return fieldErrors[field]?.[0];
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: d.benefitPricing || "Özel Fiyatlandırma",
      description: d.benefitPricingDesc || "Bayilere özel indirimli fiyatlar ve toptan satış avantajları.",
    },
    {
      icon: Building2,
      title: d.benefitOrders || "Sipariş Takibi",
      description: d.benefitOrdersDesc || "Online sipariş oluşturma, takip ve geçmiş sipariş görüntüleme.",
    },
    {
      icon: Headphones,
      title: d.benefitSupport || "Öncelikli Destek",
      description: d.benefitSupportDesc || "Bayilere özel müşteri temsilcisi ve teknik destek hattı.",
    },
    {
      icon: ShieldCheck,
      title: d.benefitRegion || "Bölgesel Koruma",
      description: d.benefitRegionDesc || "Belirlenen bölgede tek yetkili satıcı olma ayrıcalığı.",
    },
  ];

  if (success) {
    return (
      <section className="bg-cream-50">
        <div
          className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-24"
        >
          <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
            <AnimateOnScroll animation="fade-up">
              <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
                <Link href="/" className="transition-colors hover:text-white">
                  {nav.home}
                </Link>
                <ChevronRight size={14} />
                <span className="text-white">{d.title || "Bayi Kayıt"}</span>
              </nav>
              <h1 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {d.title || "Bayi Kayıt"}
              </h1>
            </AnimateOnScroll>
          </div>
        </div>

        <div className="mx-auto max-w-2xl px-4 py-16 lg:py-24">
          <AnimateOnScroll animation="fade-up">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center lg:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle size={40} className="text-emerald-600" />
              </div>
              <h2 className="mb-3 font-display text-2xl font-bold text-navy-900">
                {d.successTitle || "Başvurunuz Alındı!"}
              </h2>
              <p className="mb-6 text-neutral-600">
                {d.successMessage || "Bayilik başvurunuz alındı. Başvurunuz onaylandığında size e-posta ile bilgi verilecektir. Onay sürecinde hesabınız \"beklemede\" durumunda olacaktır."}
              </p>
              <Link
                href="/bayi-girisi"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3 font-semibold text-white transition-all hover:bg-navy-800"
              >
                {d.goToLogin || "Giriş Sayfasına Dön"}
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream-50">
      {/* Hero */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-24"
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.03]">
          <Shield
            size={420}
            strokeWidth={0.5}
            className="translate-x-1/4 text-white"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{d.title || "Bayi Kayıt"}</span>
            </nav>
            <h1 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {d.heroTitle || "Bayilik Başvurusu"}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">
              {d.heroSubtitle || "Firma bilgilerinizi girerek B2B platformumuza kayıt olun ve özel avantajlardan yararlanın."}
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Form + Benefits */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          {/* Registration Form */}
          <div className="lg:col-span-3">
            <AnimateOnScroll animation="fade-right">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm lg:p-8">
                <div className="mb-8">
                  <h2 className="font-display text-xl font-bold text-navy-900">
                    {d.formTitle || "Kurumsal Kayıt Formu"}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-500">
                    {d.formSubtitle || "Yıldızlı alanlar zorunludur."}
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Company Info Section */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-400">
                      <Building2 size={16} />
                      {d.sectionCompany || "Firma Bilgileri"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldCompanyName || "Firma Adı"} *
                        </label>
                        <div className="group relative">
                          <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="company_name"
                            type="text"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder={d.placeholderCompanyName || "Firma adını girin"}
                          />
                        </div>
                        {getFieldError("company_name") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("company_name")}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldTaxNumber || "Vergi Numarası"} *
                        </label>
                        <div className="group relative">
                          <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="tax_number"
                            type="text"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder={d.placeholderTaxNumber || "1234567890"}
                          />
                        </div>
                        {getFieldError("tax_number") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("tax_number")}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldTaxOffice || "Vergi Dairesi"}
                        </label>
                        <input
                          name="tax_office"
                          type="text"
                          className="w-full rounded-xl border border-neutral-200 bg-white py-3 px-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                          placeholder={d.placeholderTaxOffice || "Vergi dairesi adı"}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldSector || "Sektör"}
                        </label>
                        <select
                          name="sector"
                          className="w-full rounded-xl border border-neutral-200 bg-white py-3 px-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                        >
                          <option value="">{d.selectSector || "Sektör seçin"}</option>
                          {sectors.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldAddress || "Adres"}
                        </label>
                        <div className="group relative">
                          <MapPin size={18} className="absolute left-4 top-3.5 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <textarea
                            name="company_address"
                            rows={2}
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder={d.placeholderAddress || "Firma adresi"}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldCity || "Şehir"}
                        </label>
                        <input
                          name="city"
                          type="text"
                          className="w-full rounded-xl border border-neutral-200 bg-white py-3 px-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                          placeholder={d.placeholderCity || "Şehir"}
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldDistrict || "İlçe"}
                        </label>
                        <input
                          name="district"
                          type="text"
                          className="w-full rounded-xl border border-neutral-200 bg-white py-3 px-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                          placeholder={d.placeholderDistrict || "İlçe"}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Person Section */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-400">
                      <User size={16} />
                      {d.sectionContact || "Yetkili Bilgileri"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldFullName || "Ad Soyad"} *
                        </label>
                        <div className="group relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="full_name"
                            type="text"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder={d.placeholderFullName || "Yetkili kişi adı soyadı"}
                          />
                        </div>
                        {getFieldError("full_name") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("full_name")}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldEmail || "E-posta"} *
                        </label>
                        <div className="group relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder={d.placeholderEmail || "firma@ornek.com"}
                          />
                        </div>
                        {getFieldError("email") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("email")}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldPhone || "Telefon"} *
                        </label>
                        <div className="group relative">
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="phone"
                            type="tel"
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder={d.placeholderPhone || "05XX XXX XX XX"}
                          />
                        </div>
                        {getFieldError("phone") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("phone")}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-neutral-400">
                      <Lock size={16} />
                      {d.sectionPassword || "Şifre Oluştur"}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldPassword || "Şifre"} *
                        </label>
                        <div className="group relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            minLength={8}
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-12 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {getFieldError("password") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("password")}</p>
                        )}
                        <p className="mt-1 text-xs text-neutral-400">
                          {d.passwordHint || "En az 8 karakter"}
                        </p>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                          {d.fieldConfirmPassword || "Şifre Tekrar"} *
                        </label>
                        <div className="group relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors group-focus-within:text-navy-600" />
                          <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-12 text-sm outline-none transition-all focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {getFieldError("confirmPassword") && (
                          <p className="mt-1 text-xs text-red-600">{getFieldError("confirmPassword")}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="group w-full rounded-xl bg-amber-500 py-4 font-bold text-navy-900 shadow-md transition-all hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                  >
                    <span className="inline-flex items-center gap-2">
                      {isPending ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
                      ) : (
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      )}
                      {isPending
                        ? (d.submitting || "Gönderiliyor...")
                        : (d.submitButton || "Başvuruyu Gönder")}
                    </span>
                  </button>

                  <p className="text-center text-sm text-neutral-500">
                    {d.alreadyHaveAccount || "Zaten hesabınız var mı?"}{" "}
                    <Link
                      href="/bayi-girisi"
                      className="font-semibold text-navy-700 transition-colors hover:text-navy-900"
                    >
                      {d.loginLink || "Giriş yapın"}
                    </Link>
                  </p>
                </form>
              </div>
            </AnimateOnScroll>
          </div>

          {/* Benefits Sidebar */}
          <div className="lg:col-span-2">
            <AnimateOnScroll animation="fade-left">
              <div className="sticky top-8">
                <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-amber-500">
                  {d.benefitsOverline || "Bayi Avantajları"}
                </span>
                <h2 className="mb-6 font-display text-2xl font-bold text-navy-900">
                  {d.benefitsTitle || "Neden Bayimiz Olmalısınız?"}
                </h2>
                <p className="mb-8 leading-relaxed text-neutral-600">
                  {d.benefitsDesc || "Kısmet Plastik bayi ağına katılarak ayrıcalıklı fiyatlandırma ve özel destekten yararlanın."}
                </p>

                <div className="space-y-4">
                  {benefits.map((b, i) => (
                    <div
                      key={i}
                      className="group flex items-start gap-4 rounded-xl border border-neutral-100 bg-white p-5 transition-all hover:border-navy-200 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-100 text-navy-700 transition-all group-hover:bg-navy-700 group-hover:text-white">
                        <b.icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-navy-900">{b.title}</h3>
                        <p className="text-sm text-neutral-500">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
