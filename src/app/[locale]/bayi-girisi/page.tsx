"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "@/components/ui/LocaleLink";
import {
  ChevronRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Building2,
  TrendingUp,
  Headphones,
  ShieldCheck,
  ArrowRight,
  Shield,
  Percent,
  Clock,
  Truck,
  Info,
  CheckCircle,
} from "lucide-react";
import AnimateOnScroll from "@/components/ui/AnimateOnScroll";
import { useLocale } from "@/contexts/LocaleContext";
import { loginAction, forgotPasswordAction, redirectToDashboard } from "./actions";

const stats = [
  { value: 30, label: "İndirim", prefix: "%", suffix: "", icon: Percent },
  { value: 100, label: "Destek", prefix: "%", suffix: "", icon: Headphones },
  { value: 24, label: "Hizmet", prefix: "", suffix: "/7", icon: Clock },
  {
    value: 50,
    label: "Daha Hızlı Teslimat",
    prefix: "%",
    suffix: "",
    icon: Truck,
  },
];

export default function BayiGirisiPage() {
  const { dict, locale } = useLocale();
  const d = dict.dealer;
  const nav = dict.nav;
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [forgotPasswordPending, startForgotTransition] = useTransition();
  const [pendingApproval, setPendingApproval] = useState(
    () => searchParams.get("pending") === "true"
  );

  const benefits = [
    {
      icon: TrendingUp,
      title: d.benefitPricing,
      description: d.benefitPricingDesc,
    },
    {
      icon: Building2,
      title: d.benefitOrders,
      description: d.benefitOrdersDesc,
    },
    {
      icon: Headphones,
      title: d.benefitSupport,
      description: d.benefitSupportDesc,
    },
    {
      icon: ShieldCheck,
      title: d.benefitRegion,
      description: d.benefitRegionDesc,
    },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPendingApproval(false);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(formData);

      if (result.success) {
        await redirectToDashboard(locale);
      } else if (result.pending) {
        setPendingApproval(true);
        setError("");
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startForgotTransition(async () => {
      const result = await forgotPasswordAction(formData);
      if (result.success) {
        setForgotPasswordSent(true);
      } else if (result.error) {
        setError(result.error);
      }
    });
  };

  return (
    <section className="bg-cream-50">
      {/* Hero */}
      <div
        className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 py-16 lg:py-24"
        style={{
          backgroundSize: "200% 200%",
          animation: "gradient-shift 8s ease infinite",
        }}
      >
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end overflow-hidden opacity-[0.03]">
          <Shield
            size={420}
            strokeWidth={0.5}
            className="translate-x-1/4 text-white"
            style={{ animation: "float 6s ease-in-out infinite" }}
          />
        </div>
        <div
          className="pointer-events-none absolute left-8 top-12 opacity-[0.04]"
          style={{ animation: "particle-float 8s ease-in-out infinite" }}
        >
          <Lock size={100} strokeWidth={0.5} className="text-white" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-white/60">
              <Link href="/" className="transition-colors hover:text-white">
                {nav.home}
              </Link>
              <ChevronRight size={14} />
              <span className="text-white">{nav.dealer}</span>
            </nav>
            <h1 className="mb-3 font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {d.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg text-white/70">{d.heroSubtitle}</p>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Login + Benefits */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-6 lg:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Login Form */}
          <AnimateOnScroll animation="fade-right">
            <div className="relative mx-auto max-w-md lg:mx-0">
              {/* Decorative geometric shapes */}
              <div
                className="pointer-events-none absolute -left-8 -top-8 hidden h-24 w-24 rounded-2xl border-2 border-navy-200/60 lg:block"
                style={{
                  animation: "float 5s ease-in-out infinite",
                  transform: "rotate(12deg)",
                }}
              />
              <div
                className="pointer-events-none absolute -bottom-6 -right-6 hidden h-16 w-16 rounded-full border-2 border-amber-300/40 lg:block"
                style={{ animation: "float 7s ease-in-out infinite 1s" }}
              />

              <div className="animated-border-gradient rounded-2xl">
                <div className="rounded-2xl bg-white p-8 shadow-lg">
                  {/* Pending approval banner */}
                  {pendingApproval && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                      <Info size={20} className="mt-0.5 shrink-0 text-amber-600" />
                      <div>
                        <p className="font-semibold">
                          {dict.auth?.pendingTitle || "Hesabınız Onay Bekliyor"}
                        </p>
                        <p className="mt-1 text-amber-700">
                          {dict.auth?.pendingMessage || "Bayilik başvurunuz incelenmektedir. Onay işlemi tamamlandığında size e-posta ile bilgi verilecektir."}
                        </p>
                      </div>
                    </div>
                  )}

                  {showForgotPassword ? (
                    // Forgot Password Form
                    <div>
                      <div className="mb-8 flex flex-col items-center text-center">
                        <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-lg">
                          <Mail size={36} className="text-white" />
                        </div>
                        <h2 className="font-display text-xl font-bold text-navy-900">
                          {dict.auth?.forgotPasswordTitle || "Şifremi Unuttum"}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">
                          {dict.auth?.forgotPasswordSubtitle || "E-posta adresinize şifre sıfırlama bağlantısı göndereceğiz."}
                        </p>
                      </div>

                      {forgotPasswordSent ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                          <CheckCircle size={32} className="mx-auto mb-2 text-emerald-600" />
                          <p className="font-semibold text-emerald-800">
                            {dict.auth?.forgotPasswordSent || "E-posta Gönderildi!"}
                          </p>
                          <p className="mt-1 text-sm text-emerald-700">
                            {dict.auth?.forgotPasswordSentDesc || "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi."}
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleForgotPassword} className="space-y-5">
                          {error && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                              {error}
                            </div>
                          )}

                          <div>
                            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                              {d.fieldEmail}
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
                            disabled={forgotPasswordPending}
                            className="group w-full rounded-xl bg-amber-500 py-3.5 font-bold text-navy-900 shadow-md transition-all hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60"
                          >
                            <span className="inline-flex items-center gap-2">
                              {forgotPasswordPending ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
                              ) : (
                                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                              )}
                              {forgotPasswordPending
                                ? (dict.auth?.sending || "Gönderiliyor...")
                                : (dict.auth?.sendResetLink || "Sıfırlama Bağlantısı Gönder")}
                            </span>
                          </button>
                        </form>
                      )}

                      <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                        <button
                          onClick={() => {
                            setShowForgotPassword(false);
                            setForgotPasswordSent(false);
                            setError("");
                          }}
                          className="text-sm font-semibold text-navy-700 transition-colors hover:text-navy-900"
                        >
                          {dict.auth?.backToLogin || "Giriş sayfasına dön"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Login Form
                    <div>
                      <div className="mb-8 flex flex-col items-center text-center">
                        <div
                          className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-navy-700 to-navy-900 shadow-lg"
                          style={{
                            animation: "pulse-glow 3s ease-in-out infinite",
                          }}
                        >
                          <Shield size={36} className="text-white" />
                          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-md">
                            <Lock size={12} className="text-navy-900" />
                          </div>
                        </div>
                        <h2 className="font-display text-xl font-bold text-navy-900">
                          {d.loginTitle}
                        </h2>
                        <p className="mt-1 text-sm text-neutral-500">
                          {d.loginSubtitle}
                        </p>
                      </div>

                      {error && !pendingApproval && (
                        <div
                          className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                          style={{
                            animation:
                              "slide-down-fade 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
                          }}
                        >
                          {error}
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {d.fieldEmail}
                          </label>
                          <div className="group relative">
                            <Mail
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-navy-600"
                            />
                            <input
                              type="email"
                              name="email"
                              required
                              className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-4 text-sm outline-none transition-all duration-300 focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                              placeholder="bayi@firma.com"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                            {d.fieldPassword}
                          </label>
                          <div className="group relative">
                            <Lock
                              size={18}
                              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-navy-600"
                            />
                            <input
                              type={showPassword ? "text" : "password"}
                              name="password"
                              required
                              className="w-full rounded-xl border border-neutral-200 py-3 pl-11 pr-12 text-sm outline-none transition-all duration-300 focus:border-navy-600 focus:shadow-[0_0_0_4px_rgba(10,22,40,0.08)]"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 transition-all duration-300 hover:scale-110 hover:text-neutral-600 active:scale-95"
                            >
                              <span className="relative block h-[18px] w-[18px]">
                                <Eye
                                  size={18}
                                  className={`absolute inset-0 transition-all duration-300 ${
                                    showPassword
                                      ? "rotate-90 scale-0 opacity-0"
                                      : "rotate-0 scale-100 opacity-100"
                                  }`}
                                />
                                <EyeOff
                                  size={18}
                                  className={`absolute inset-0 transition-all duration-300 ${
                                    showPassword
                                      ? "rotate-0 scale-100 opacity-100"
                                      : "-rotate-90 scale-0 opacity-0"
                                  }`}
                                />
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-sm text-neutral-600">
                            <input
                              type="checkbox"
                              className="rounded border-neutral-300"
                            />
                            {d.rememberMe}
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForgotPassword(true);
                              setError("");
                            }}
                            className="text-sm font-medium text-navy-700 transition-colors hover:text-navy-900"
                          >
                            {d.forgotPassword}
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={isPending}
                          className="group w-full rounded-xl bg-amber-500 py-3.5 font-bold text-navy-900 shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                        >
                          <span className="inline-flex items-center gap-2">
                            {isPending ? (
                              <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-900 border-t-transparent" />
                            ) : (
                              <ArrowRight
                                size={16}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            )}
                            {isPending ? "Giriş yapılıyor..." : d.loginButton}
                          </span>
                        </button>
                      </form>

                      <div className="mt-6 border-t border-neutral-100 pt-6 text-center">
                        <p className="text-sm text-neutral-500">
                          {d.notDealer}{" "}
                          <Link
                            href="/bayi-kayit"
                            className="font-semibold text-navy-700 transition-colors hover:text-navy-900"
                          >
                            {d.applyDealer}
                          </Link>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Benefits */}
          <AnimateOnScroll animation="fade-left">
            <div>
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-amber-500">
                {d.benefitsOverline}
              </span>
              <h2 className="mb-6 font-display text-2xl font-bold text-navy-900 sm:text-3xl">
                {d.benefitsTitle}
              </h2>
              <p className="mb-8 leading-relaxed text-neutral-600">
                {d.benefitsDesc}
              </p>

              <div className="relative space-y-4">
                <div className="absolute bottom-8 left-[2.4rem] top-8 w-px bg-gradient-to-b from-navy-200 via-amber-300 to-navy-200 opacity-50" />

                {benefits.map((b, i) => (
                  <div
                    key={b.title}
                    className="group relative flex items-start gap-4 rounded-xl border border-neutral-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-navy-200 hover:shadow-md"
                  >
                    <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-amber-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative shrink-0">
                      <span className="absolute -left-1 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-navy-900 shadow-sm transition-transform duration-300 group-hover:scale-110">
                        {i + 1}
                      </span>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 text-navy-700 transition-all duration-300 group-hover:bg-navy-700 group-hover:text-white group-hover:shadow-lg">
                        <b.icon size={20} />
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-navy-900 transition-colors duration-300 group-hover:text-navy-700">
                        {b.title}
                      </h3>
                      <p className="text-sm text-neutral-500 transition-colors duration-300 group-hover:text-neutral-600">
                        {b.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/bayi-kayit"
                  className="group inline-flex items-center gap-2 font-semibold text-navy-700 transition-colors hover:text-amber-600"
                >
                  {d.contactForDealer}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 to-navy-800 py-16 lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-navy-300/10 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 lg:px-6">
          <AnimateOnScroll animation="fade-up">
            <div className="mb-12 text-center">
              <span className="mb-3 inline-block text-sm font-bold uppercase tracking-widest text-amber-400">
                Avantajlar
              </span>
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Neden Bayi Olmalısınız?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/60">
                Kısmet Plastik bayi ağına katılarak ayrıcalıklı fiyatlandırma ve
                özel destekten yararlanın.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <AnimateOnScroll
                key={stat.label}
                animation="fade-up"
                delay={i * 150}
              >
                <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/30">
                    <stat.icon size={28} />
                  </div>

                  <div className="mb-2 text-4xl font-extrabold text-white">
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </div>

                  <p className="font-semibold text-white/80">{stat.label}</p>

                  <div className="mx-auto mt-4 h-1.5 w-3/4 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(stat.value, 100)}%` }}
                    />
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
