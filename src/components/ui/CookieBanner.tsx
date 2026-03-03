"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "@/components/ui/LocaleLink";
import { Cookie, Settings, ChevronDown } from "lucide-react";
import { useLocale } from "@/contexts/LocaleContext";

const STORAGE_KEY = "kismetplastik-cookie-consent";

interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

function getStoredPreferences(): CookiePreferences | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function applyConsent(prefs: CookiePreferences) {
  // GA4 consent mode
  if (typeof window !== "undefined" && "gtag" in window) {
    const gtag = (window as Record<string, unknown>).gtag as (
      cmd: string,
      action: string,
      params: Record<string, string>
    ) => void;
    gtag("consent", "update", {
      analytics_storage: prefs.analytics ? "granted" : "denied",
      ad_storage: prefs.marketing ? "granted" : "denied",
      ad_user_data: prefs.marketing ? "granted" : "denied",
      ad_personalization: prefs.marketing ? "granted" : "denied",
    });
  }
}

export default function CookieBanner() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const prefs = getStoredPreferences();
    if (prefs) {
      applyConsent(prefs);
    } else {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = useCallback(
    (prefs: CookiePreferences) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      } catch {
        /* localStorage unavailable */
      }
      applyConsent(prefs);
      setVisible(false);
    },
    []
  );

  const acceptAll = () => {
    savePreferences({ necessary: true, analytics: true, marketing: true });
  };

  const declineAll = () => {
    savePreferences({ necessary: true, analytics: false, marketing: false });
  };

  const saveCustom = () => {
    savePreferences({ necessary: true, analytics, marketing });
  };

  if (!visible) return null;

  const isTr = locale === "tr";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-[fade-in-up_500ms_ease-out_forwards]">
      <div className="mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900 sm:p-6">
        {/* Main Banner */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Cookie size={24} className="mt-0.5 shrink-0 text-accent-500" />
            <div>
              <p className="text-sm font-semibold text-primary-900 dark:text-white">
                {isTr ? "Çerez Kullanımı" : "Cookie Usage"}
              </p>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {isTr
                  ? "Bu web sitesi, deneyiminizi geliştirmek için çerezler kullanmaktadır. 6698 sayılı KVKK kapsamında kişisel verileriniz işlenmektedir. "
                  : "This website uses cookies to improve your experience. Your personal data is processed in accordance with KVKK regulations. "}
                <Link
                  href="/kvkk"
                  className="font-medium text-primary-700 underline underline-offset-2 hover:text-primary-900 dark:text-primary-300"
                >
                  {isTr ? "KVKK Aydınlatma Metni" : "Privacy Policy"}
                </Link>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <Settings size={14} />
              {isTr ? "Ayarlar" : "Settings"}
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${showSettings ? "rotate-180" : ""}`}
              />
            </button>
            <button
              onClick={declineAll}
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {isTr ? "Reddet" : "Decline"}
            </button>
            <button
              onClick={acceptAll}
              className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
            >
              {isTr ? "Tümünü Kabul Et" : "Accept All"}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-700">
            <div className="space-y-3">
              {/* Necessary */}
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
                <div>
                  <p className="text-sm font-semibold text-primary-900 dark:text-white">
                    {isTr ? "Zorunlu Çerezler" : "Necessary Cookies"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {isTr
                      ? "Sitenin çalışması için gerekli temel çerezler. Devre dışı bırakılamaz."
                      : "Essential cookies required for the site to function. Cannot be disabled."}
                  </p>
                </div>
                <div className="relative ml-4 inline-flex h-6 w-10 shrink-0 cursor-not-allowed items-center rounded-full bg-accent-500">
                  <span className="inline-block h-4 w-4 translate-x-5 rounded-full bg-white shadow-sm" />
                </div>
              </div>

              {/* Analytics */}
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
                <div>
                  <p className="text-sm font-semibold text-primary-900 dark:text-white">
                    {isTr ? "Analitik Çerezler" : "Analytics Cookies"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {isTr
                      ? "Ziyaretçi davranışlarını anlamamıza yardımcı olan anonim istatistik çerezleri."
                      : "Anonymous statistics cookies that help us understand visitor behavior."}
                  </p>
                </div>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`relative ml-4 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                    analytics ? "bg-accent-500" : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                  aria-label={isTr ? "Analitik çerezleri aç/kapat" : "Toggle analytics cookies"}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      analytics ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Marketing */}
              <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
                <div>
                  <p className="text-sm font-semibold text-primary-900 dark:text-white">
                    {isTr ? "Pazarlama Çerezleri" : "Marketing Cookies"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {isTr
                      ? "Kişiselleştirilmiş reklamlar ve kampanyalar için kullanılan çerezler."
                      : "Cookies used for personalized ads and campaigns."}
                  </p>
                </div>
                <button
                  onClick={() => setMarketing(!marketing)}
                  className={`relative ml-4 inline-flex h-6 w-10 shrink-0 items-center rounded-full transition-colors ${
                    marketing ? "bg-accent-500" : "bg-neutral-300 dark:bg-neutral-600"
                  }`}
                  aria-label={isTr ? "Pazarlama çerezlerini aç/kapat" : "Toggle marketing cookies"}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                      marketing ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={saveCustom}
                className="rounded-lg bg-primary-900 px-5 py-2 text-sm font-bold text-white transition-all hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
              >
                {isTr ? "Seçimi Kaydet" : "Save Preferences"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
