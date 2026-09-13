import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpFromLine,
  Bell,
  ChevronDown,
  CircleUserRound,
  CreditCard,
  Home,
  KeyRound,
  LogOut,
  Repeat,
  Search,
  Settings,
  ShieldCheck,
  Wallet,
  Webhook as WebhookIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogout } from "../../hooks/useLogout";
import { useProfile } from "../../hooks/useProfile";
import { getStoredBusiness } from "../../lib/session";
import { NotificationBell } from "./NotificationBell";
import "../../styles/geist.css";

type NavItem = { key: string; icon: typeof Home; to?: string };

const navSections: { headingKey?: string; items: NavItem[] }[] = [
  {
    items: [
      { key: "overview", icon: Home, to: "/dashboard" },
      { key: "kyc", icon: ShieldCheck, to: "/dashboard/kyc" },
      { key: "transactions", icon: ArrowLeftRight, to: "/dashboard/transactions" },
      { key: "notifications", icon: Bell, to: "/dashboard/notifications" },
      { key: "accountSettings", icon: Settings, to: "/dashboard/profile" },
    ],
  },
  {
    headingKey: "wallet",
    items: [
      { key: "balance", icon: Wallet, to: "/dashboard/wallet" },
      { key: "deposit", icon: ArrowDownToLine, to: "/dashboard/deposit" },
      { key: "withdraw", icon: ArrowUpFromLine, to: "/dashboard/withdraw" },
      { key: "swap", icon: Repeat, to: "/dashboard/swap" },
      { key: "cards", icon: CreditCard, to: "/dashboard/cards" },
    ],
  },
  {
    headingKey: "developers",
    items: [
      { key: "apiKeys", icon: KeyRound, to: "/dashboard/api-keys" },
      { key: "webhooks", icon: WebhookIcon, to: "/dashboard/webhooks" },
    ],
  },
];

export function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const business = getStoredBusiness();
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();
  const profile = useProfile();
  const showPinBanner = profile.data && !profile.data.pin_set;
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [langOpen]);

  const switchLang = (lng: "fr" | "en") => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout.mutate(undefined, { onSettled: () => navigate("/login") });
  };

  return (
    <div className="font-geist flex min-h-screen bg-surface">
      {/* ---------- Sidebar ---------- */}
      <aside className="hidden w-64 shrink-0 flex-col bg-[#020D30] lg:sticky lg:top-0 lg:flex lg:h-screen">
        <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-8">
          {navSections.map((section, i) => (
            <div key={i}>
              {section.headingKey && (
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">
                  {t(`dashboard.nav.${section.headingKey}`)}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = item.to === location.pathname;
                  const className = `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`;
                  const label = t(`dashboard.nav.${item.key}`);
                  return item.to ? (
                    <Link key={item.key} to={item.to} className={className}>
                      <item.icon size={18} strokeWidth={1.75} className="shrink-0" />
                      <span>{label}</span>
                    </Link>
                  ) : (
                    <a key={item.key} href="#" className={className}>
                      <item.icon size={18} strokeWidth={1.75} className="shrink-0" />
                      <span>{label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            disabled={logout.isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
          >
            <LogOut size={18} strokeWidth={1.75} className="shrink-0" />
            <span>{logout.isPending ? t("dashboard.loggingOut") : t("dashboard.logout")}</span>
          </button>
        </div>
      </aside>

      {/* ---------- Contenu ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between gap-6 border-b border-black/[0.06] bg-white px-6 lg:px-8">
          {/* Logo dans le header */}
          <Link to="/dashboard" className="flex shrink-0 items-center">
            <img
              src="/assets/icons/logo.png"
              alt="TrustSend"
              className="h-40 w-auto object-contain"
            />
          </Link>

          <div className="relative hidden max-w-md flex-1 sm:block">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="search"
              placeholder={t("dashboard.searchPlaceholder")}
              className="w-full rounded-full border border-black/10 bg-white py-2 pl-10 pr-4 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 hover:border-black/20 focus:border-brand focus:ring-4 focus:ring-brand-light"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-ink sm:inline-flex">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {t("dashboard.liveMode")}
            </span>
            <button
              aria-label={t("dashboard.activity")}
              className="hidden h-9 w-9 items-center justify-center rounded-full text-muted-2 transition-colors hover:bg-surface hover:text-ink sm:flex"
            >
              <Activity size={18} />
            </button>
            <NotificationBell />

            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen((o) => !o)}
                aria-expanded={langOpen}
                className="flex items-center gap-1 rounded-full px-2.5 py-2 text-sm font-medium text-muted-2 transition-colors hover:bg-surface hover:text-ink"
              >
                {i18n.language.startsWith("en") ? "EN" : "FR"}{" "}
                <ChevronDown size={14} className="opacity-60" />
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-20 mt-2 w-28 overflow-hidden rounded-xl border border-surface-2 bg-white py-1 shadow-pop"
                  >
                    <button
                      onClick={() => switchLang("fr")}
                      className={`block w-full px-3 py-2 text-left text-sm font-medium hover:bg-surface ${
                        i18n.language.startsWith("fr") ? "text-brand" : "text-ink"
                      }`}
                    >
                      Français
                    </button>
                    <button
                      onClick={() => switchLang("en")}
                      className={`block w-full px-3 py-2 text-left text-sm font-medium hover:bg-surface ${
                        i18n.language.startsWith("en") ? "text-brand" : "text-ink"
                      }`}
                    >
                      English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/dashboard/profile"
              aria-label={t("dashboard.account")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-2 transition-colors hover:bg-brand-light hover:text-brand"
            >
              <CircleUserRound size={20} />
            </Link>
          </div>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8">
          {showPinBanner && (
            <Link
              to="/dashboard/profile"
              className="group mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-surface-2 bg-white px-4 py-3 text-sm transition-colors hover:border-amber-300"
            >
              <KeyRound size={15} className="shrink-0 text-amber-600" />
              <span className="font-medium text-ink">{t("dashboard.pinBanner.title")}</span>
              <span className="text-muted">{t("dashboard.pinBanner.desc")}</span>
              <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold text-amber-600">
                {t("dashboard.pinBanner.cta")}
                <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          )}
          <Outlet context={{ business }} />
        </main>
      </div>
    </div>
  );
}
