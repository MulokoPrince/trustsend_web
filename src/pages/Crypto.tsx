import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Bell,
  CreditCard,
  Info,
  KeyRound,
  Lock,
  Repeat,
  Send,
  ShieldCheck,
  Smartphone,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CookieConsent } from "../components/CookieConsent";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { Reveal } from "../components/Reveal";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import type { CryptoAsset } from "../data/content.fr";
import arcAsset from "../assets/Group (1).png";
import loopPattern from "../assets/Group (2).png";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  ArrowLeftRight,
  Repeat,
  ShieldCheck,
  Smartphone,
  Send,
  CreditCard,
  Lock,
  BadgeCheck,
  Bell,
  KeyRound,
};

const HERO_PHOTO =
  "/assets/images/crypto-hero.avif";


type Quote = { price: number; change: number };

// Cours publics CoinGecko (les logos sont servis en local),
// avec repli sur les valeurs de reference du contenu
function useCryptoQuotes(assets: CryptoAsset[]) {
  const [quotes, setQuotes] = useState<Record<string, Quote> | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const ids = assets.map((a) => a.id).join(",");

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h`,
      { signal: controller.signal },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(
        (
          data: {
            id: string;
            current_price: number;
            price_change_percentage_24h: number | null;
          }[],
        ) => {
          const next: Record<string, Quote> = {};
          for (const coin of data) {
            if (typeof coin?.current_price === "number") {
              next[coin.id] = {
                price: coin.current_price,
                change: coin.price_change_percentage_24h ?? 0,
              };
            }
          }
          if (Object.keys(next).length > 0) {
            setQuotes(next);
            setUpdatedAt(new Date());
          }
        },
      )
      .catch(() => {
        /* cours et logos de repli conserves */
      });

    return () => controller.abort();
  }, [ids]);

  return { quotes, updatedAt, live: quotes !== null };
}

export function Crypto() {
  const { i18n } = useTranslation();
  const { cryptoPage, cryptoCoins, mobileMoneyProviders } = useContent();
  const { hero, market, features, steps, stablecoins, security, fees, risk, faq, cta } =
    cryptoPage;

  const { quotes, updatedAt, live } = useCryptoQuotes(cryptoCoins);

  const assets = useMemo(
    () =>
      cryptoCoins.map((coin) => {
        const q = quotes?.[coin.id];
        const price = q?.price ?? coin.fallbackPrice;
        const change = q?.change ?? coin.fallbackChange;
        return { ...coin, price, change, up: change >= 0, image: coin.logo };
      }),
    [cryptoCoins, quotes],
  );

  const stableAssets = assets.filter((a) => a.stable);
  const otherAssets = assets.filter((a) => !a.stable);

  const priceFormatter = (value: number) =>
    new Intl.NumberFormat(i18n.language, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: value < 5 ? 4 : 2,
      maximumFractionDigits: value < 5 ? 4 : 2,
    }).format(value);

  const changeFormatter = (value: number) =>
    `${value >= 0 ? "+" : ""}${new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)} %`;

  return (
    <div className="overflow-x-hidden">
      <Nav />

      <main>
        {/* ===================================================== HERO ===== */}
        <section className="relative overflow-hidden bg-surface-2 pt-32 pb-16 lg:pt-40 lg:pb-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <span className="text-sm font-semibold tracking-wide text-brand">
                {hero.eyebrow}
              </span>
              <h1 className="mt-3 font-display text-3xl font-bold text-balance text-ink lg:text-4xl">
                {hero.title} <span className="text-accent">{hero.titleAccent}</span>
              </h1>
              <p className="mt-4 max-w-md text-lg text-muted">{hero.subtitle}</p>
            </div>

            <div className="relative mx-auto w-full max-w-[620px] lg:max-w-[660px]">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-light opacity-70 blur-3xl"
              />
              <img
                src={HERO_PHOTO}
                alt="Achat de cryptomonnaies depuis un téléphone mobile"
                loading="eager"
                decoding="async"
                className="mx-auto block aspect-[4/3] w-full select-none rounded-4xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* =================================================== MARKET ===== */}
        <section className="relative overflow-hidden py-24">
          <img
            src={arcAsset}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-16 hidden w-24 select-none opacity-80 lg:block"
          />

          <div className="relative mx-auto max-w-5xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold tracking-wide text-brand">
                {market.eyebrow}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                {market.title}
              </h2>
              <p className="mt-4 text-lg text-muted">{market.subtitle}</p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      live ? "animate-pulse bg-[#16a34a]" : "bg-muted/40"
                    }`}
                  />
                  {market.liveLabel}
                </span>
                {updatedAt && (
                  <span>
                    {market.updatedLabel}{" "}
                    {updatedAt.toLocaleTimeString(i18n.language, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
                <span>{market.sourceLabel}</span>
              </div>
            </Reveal>

            {/* ----- Stablecoins, mis en avant ----- */}
            <Reveal delay={0.1}>
              <div className="mt-12 rounded-5xl border border-brand/15 bg-brand-light/40 p-6 lg:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-ink">
                      {market.stableTitle}
                    </h3>
                    <p className="mt-1 max-w-xl text-sm text-muted">
                      {market.stableSubtitle}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand">
                    {market.pegLabel}
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {stableAssets.map((coin) => (
                    <div
                      key={coin.symbol}
                      className="rounded-3xl border border-surface-2 bg-white p-5"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="h-10 w-10 shrink-0 rounded-full object-contain"
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-display font-semibold text-ink">
                            {coin.name}
                          </span>
                          {coin.network && (
                            <span className="block text-[11px] text-muted">
                              {coin.network}
                            </span>
                          )}
                        </span>
                      </div>

                      <p className="mt-4 font-display text-2xl font-bold text-ink">
                        {priceFormatter(coin.price)}
                      </p>
                      <p
                        className={`mt-0.5 text-xs font-semibold ${
                          coin.up ? "text-[#16a34a]" : "text-[#dc2626]"
                        }`}
                      >
                        {changeFormatter(coin.change)} · {market.change24h}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* ----- Autres actifs ----- */}
            <Reveal delay={0.15}>
              <h3 className="mt-14 font-display text-xl font-bold text-ink">
                {market.othersTitle}
              </h3>

              <div className="mt-5 overflow-hidden rounded-4xl border border-surface-2">
                <div className="hidden grid-cols-[1.4fr_1fr_1fr] gap-4 border-b border-surface-2 bg-surface px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted sm:grid">
                  <span>&nbsp;</span>
                  <span className="text-right">{market.priceLabel}</span>
                  <span className="text-right">{market.change24h}</span>
                </div>

                {otherAssets.map((coin) => (
                  <div
                    key={coin.symbol}
                    className="grid grid-cols-[1.4fr_1fr_1fr] items-center gap-4 border-b border-surface-2 px-6 py-4 last:border-0 transition-colors hover:bg-surface"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        width={36}
                        height={36}
                        loading="lazy"
                        className="h-9 w-9 shrink-0 rounded-full object-contain"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-display font-semibold text-ink">
                          {coin.name}
                        </span>
                        <span className="block text-xs text-muted">
                          {coin.symbol}
                        </span>
                      </span>
                    </div>

                    <span className="text-right font-display font-semibold text-ink">
                      {priceFormatter(coin.price)}
                    </span>

                    <span
                      className={`flex items-center justify-end gap-1 text-sm font-semibold ${
                        coin.up ? "text-[#16a34a]" : "text-[#dc2626]"
                      }`}
                    >
                      {coin.up ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {changeFormatter(coin.change)}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <p className="mt-3 text-center text-xs text-muted">
              {live ? market.note : market.offlineNote}
            </p>
          </div>
        </section>

        {/* ================================================= FEATURES ===== */}
        <section className="relative overflow-hidden py-24">
          <img
            src={loopPattern}
            alt=""
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-20 hidden w-72 select-none opacity-20 lg:block"
          />

          <div className="relative mx-auto max-w-7xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-bold text-ink lg:text-4xl">
                {features.title}
              </h2>
              <p className="mt-4 text-lg text-muted">{features.subtitle}</p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.items.map((item, i) => {
                const Icon = icons[item.icon] ?? ArrowLeftRight;
                return (
                  <Reveal key={item.title} delay={i * 0.06}>
                    <div className="group h-full rounded-4xl border border-surface-2 p-6 transition-all hover:border-brand/20 hover:shadow-soft">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-light transition-colors group-hover:bg-brand">
                        <Icon
                          size={18}
                          className="text-brand transition-colors group-hover:text-white"
                        />
                      </div>
                      <h3 className="mt-4 font-display font-semibold text-ink">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted">{item.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==================================================== STEPS ===== */}
        <section className="bg-surface py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold tracking-wide text-brand">
                {steps.eyebrow}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                {steps.title}
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {steps.items.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.08}>
                  <div className="h-full rounded-4xl border border-surface-2 bg-white p-6">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand font-display text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="mt-4 font-display font-semibold text-ink">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* =============================================== STABLECOINS ===== */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <img
                  src={stablecoins.photo}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-5xl object-cover"
                />
              </Reveal>

              <Reveal delay={0.1}>
                <span className="text-sm font-semibold tracking-wide text-brand">
                  {stablecoins.eyebrow}
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                  {stablecoins.title}
                </h2>
                <p className="mt-4 text-lg text-muted">{stablecoins.desc}</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {stablecoins.items.map((item) => (
                    <div key={item.title}>
                      <p className="font-display font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================= SECURITY ===== */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold tracking-wide text-brand">
                {security.eyebrow}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                {security.title}
              </h2>
              <p className="mt-4 text-lg text-muted">{security.desc}</p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {security.items.map((item, i) => {
                const Icon = icons[item.icon] ?? ShieldCheck;
                return (
                  <Reveal key={item.title} delay={i * 0.06}>
                    <div className="h-full rounded-4xl border border-surface-2 p-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light">
                        <Icon size={17} className="text-brand" />
                      </div>
                      <p className="mt-3 font-display font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-muted">{item.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ===================================================== FEES ===== */}
        <section className="pb-24">
          <div className="mx-auto max-w-5xl px-6">
            <Reveal className="mx-auto max-w-2xl text-center">
              <span className="text-sm font-semibold tracking-wide text-brand">
                {fees.eyebrow}
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                {fees.title}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-12 overflow-hidden rounded-4xl border border-surface-2">
                {fees.rows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between px-6 py-4 ${
                      i % 2 === 1 ? "bg-surface" : ""
                    }`}
                  >
                    <span className="text-sm text-ink/80">{row.label}</span>
                    <span className="font-display font-bold text-brand">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <p className="mt-3 text-center text-xs text-muted">{fees.note}</p>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {fees.providersLabel}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {mobileMoneyProviders.map((p) => (
                    <img
                      key={p.name}
                      src={p.src}
                      alt={p.name}
                      className="h-8 w-8 rounded-md border border-surface-2 bg-white object-contain p-1"
                    />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ===================================================== RISK ===== */}
        <section className="px-6 pb-24">
          <Reveal className="mx-auto max-w-5xl">
            <div className="flex gap-4 rounded-4xl border border-surface-2 bg-surface p-6">
              <Info size={20} className="mt-0.5 shrink-0 text-brand" />
              <div>
                <p className="font-display font-semibold text-ink">
                  {risk.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {risk.desc}
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ====================================================== FAQ ===== */}
        <section className="pb-24">
          <div className="mx-auto max-w-3xl px-6">
            <Reveal className="text-center">
              <h2 className="font-display text-3xl font-bold text-ink lg:text-4xl">
                {faq.title}
              </h2>
            </Reveal>

            <div className="mt-10 divide-y divide-surface-2 border-y border-surface-2">
              {faq.items.map((item, i) => (
                <Reveal key={item.q} delay={i * 0.05}>
                  <details className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-semibold text-ink marker:hidden">
                      {item.q}
                      <span className="shrink-0 text-brand transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================== CTA ===== */}
        <section className="px-6 pb-24">
          <Reveal className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-5xl bg-brand px-8 py-16 text-center lg:py-20">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10" />

              <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-bold text-white lg:text-4xl">
                {cta.title}
              </h2>
              <p className="relative mx-auto mt-4 max-w-2xl text-lg text-white/80">
                {cta.desc}
              </p>

              <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-brand transition-colors hover:bg-white/90"
                >
                  {cta.primary} <ArrowRight size={18} />
                </a>
                <a
                  href="https://wa.me/243972716360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-semibold text-white transition-colors hover:border-white"
                >
                  {cta.secondary}
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
}
