import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { Reveal } from "./Reveal";
import heroAsset from "../assets/hero.png";
import patternAsset from "../assets/Group.png";
import bgAsset from "../assets/bg.png";

const SLIDE_COUNT = 2;

export function Hero() {
  const { t } = useTranslation();
  const { heroCapabilities, heroSpotlight, paymentMethods, recommendationChips } =
    useContent();
  const [slide, setSlide] = useState(0);
  const [capIndex, setCapIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCapIndex((i) => (i + 1) % heroCapabilities.length);
    }, 2600);

    return () => clearInterval(t);
  }, []);

  const prevSlide = () =>
    setSlide((s) => (s - 1 + SLIDE_COUNT) % SLIDE_COUNT);

  const nextSlide = () =>
    setSlide((s) => (s + 1) % SLIDE_COUNT);

  return (
    <section className="relative overflow-hidden pt-30 pb-16">
      {/* Navigation gauche */}
      <button
        onClick={prevSlide}
        aria-label={t("hero.slidePrev")}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-card text-muted-2 hover:text-brand transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Navigation droite */}
      <button
        onClick={nextSlide}
        aria-label={t("hero.slideNext")}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-white shadow-card text-muted-2 hover:text-brand transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      <div className="relative mx-auto max-w-7xl px-10 bg-[#020D30]">
        {/* Illustration décorative */}
        <motion.img
          src={heroAsset}
          alt=""
          aria-hidden
          className="pointer-events-none absolute top-10 left-4 hidden w-36 select-none opacity-20 drop-shadow-[0_25px_60px_rgba(124,58,237,0.5)] sm:block md:right-10 lg:top-0 lg:w-52"
          animate={{ y: [0, -16, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Pattern décoratif */}
        <img
          src={patternAsset}
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-4 bottom-24 hidden w-40 select-none opacity-30 md:block lg:bottom-20 lg:w-56"
        />

        <AnimatePresence mode="wait">
          {/* =========================================================
              SLIDE 1 — MOBILE MONEY
          ========================================================= */}
          {slide === 0 ? (
            <motion.div
              key="capability-slide"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
            >
              {/* Colonne texte */}
              <div className="max-w-xl">
                <Reveal>
                  <h1 className="font-display font-bold text-[1.95rem] sm:text-4xl lg:text-[2.6rem] leading-[1.12] tracking-tight text-white text-balance">
                    {t("hero.headline")}{" "}
                    <span className="text-accent">
                      {t("hero.headlineAccent")}
                    </span>
                  </h1>
                </Reveal>

                <Reveal delay={0.1}>
                  <p className="mt-5 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
                    {t("hero.subtext")}
                  </p>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded bg-accent px-6 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-accent/90"
                    >
                      {t("hero.ctaStart")}
                      <ArrowRight size={18} />
                    </a>

                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white transition-colors hover:border-white"
                    >
                      {t("hero.ctaLearnMore")}
                    </a>
                  </div>
                </Reveal>

                <Reveal delay={0.3}>
                  <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                      {t("hero.availablePayments")}
                    </span>

                    <div className="flex items-center gap-3">
                      {paymentMethods.map((m) => (
                        <img
                          key={m.name}
                          src={m.src}
                          alt={m.name}
                          className="h-7 w-7 rounded-md border border-white/15 bg-white/5 object-contain transition hover:opacity-90 hover:grayscale-0"
                        />
                      ))}
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Colonne visuelle */}
              <Reveal delay={0.15}>
                <div className="relative mx-auto w-full max-w-[460px]">
                  {/* Halo décoratif */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-light opacity-70 blur-3xl"
                  />

                  <motion.img
                    key={capIndex}
                    src={bgAsset}
                    alt="Aperçu de l'application TrustSend"
                    className="mx-auto block aspect-[5/4] w-full select-none object-contain lg:scale-125 lg:h-[60vh]"
                  />

                  {/* Indicateurs */}
                  <div className="mt-8 flex justify-center gap-2">
                    {heroCapabilities.map((s, i) => (
                      <button
                        key={s.label}
                        onClick={() => setCapIndex(i)}
                        aria-label={t("hero.showLabel", { label: s.label })}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          i === capIndex
                            ? "w-7 bg-accent"
                            : "w-2 bg-white/25"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            </motion.div>
          ) : (
            /* =========================================================
                SLIDE 2 — SPOTLIGHT
            ========================================================= */
            <motion.div
              key="spotlight-slide"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 1, x: -24 }}
              transition={{
                duration: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
            >
              <div className="max-w-xl">
                <Reveal>
                  <p className="font-display font-bold text-[1.75rem] sm:text-3xl lg:text-[2.35rem] leading-[1.12] tracking-tight text-accent-light">
                    {heroSpotlight.eyebrow}
                  </p>

                  <p className="font-display font-bold text-[1.75rem] sm:text-3xl lg:text-[2.35rem] leading-[1.12] tracking-tight text-white">
                    {heroSpotlight.heading}
                  </p>
                </Reveal>

                <Reveal delay={0.1}>
                  <p className="mt-5 text-white/70">
                    {heroSpotlight.subline}
                  </p>
                </Reveal>

                <Reveal delay={0.2}>
                  <div className="mt-8 flex flex-wrap items-center gap-5">
                    <a
                      href="#"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-accent/90"
                    >
                      {t("hero.ctaSignupNow")}
                      <ArrowRight size={18} />
                    </a>

                    <a
                      href="#"
                      className="font-semibold text-white transition-colors hover:text-accent-light"
                    >
                      {t("hero.ctaLearnMore")}
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Visuel spotlight */}
              <Reveal delay={0.15}>
                <div className="relative mx-auto w-full max-w-[340px]">
                  <div
                    aria-hidden
                    className="absolute -right-6 -top-10 h-64 w-64 bg-brand"
                    style={{
                      clipPath:
                        "polygon(60% 0%, 100% 40%, 55% 100%, 20% 60%)",
                    }}
                  />

                  <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-[32px] border border-surface-2 bg-gradient-to-br from-brand-light to-white">
                    <User
                      size={96}
                      className="text-brand/25"
                      strokeWidth={1.2}
                    />
                  </div>

                  {/* Application */}
                  <div className="absolute top-6 right-0 w-40 rounded-2xl bg-accent-light p-3 shadow-pop">
                    <p className="text-xs font-bold text-ink">
                      {heroSpotlight.appName}
                    </p>

                    <p className="text-[10px] text-ink/60">
                      {t("hero.poweredBy")}
                    </p>
                  </div>

                  {/* Paiement */}
                  <div className="absolute bottom-16 -right-6 w-44 rounded-2xl bg-white p-3 shadow-pop">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] text-muted">
                        {heroSpotlight.productLabel}
                      </p>

                      <p className="text-xs font-bold text-ink">
                        {heroSpotlight.price}
                      </p>
                    </div>

                    <p className="mt-2 text-[10px] font-semibold text-muted">
                      Select payment method
                    </p>

                    <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                      {["Card", "UPI ID", "Netbanking", "EMI"].map((m) => (
                        <span
                          key={m}
                          className="rounded-md bg-surface px-1.5 py-1 text-center text-[9px] text-ink/70"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Signature */}
                  <p
                    className="absolute -bottom-2 left-2 text-3xl text-brand"
                    style={{
                      fontFamily: "var(--font-signature)",
                    }}
                  >
                    {heroSpotlight.signature}
                  </p>

                  <p className="absolute bottom-0 left-2 translate-y-6 text-[10px] font-semibold uppercase tracking-wide text-white/60">
                    {heroSpotlight.attribution}
                  </p>
                </div>
              </Reveal>
            </motion.div>
          )}

          {/* =========================================================
              RECOMMENDATIONS
          ========================================================= */}
          <Reveal delay={0.25}>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded border border-surface-2 bg-white px-5 py-4 lg:-mb-20">
              <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-ink bg-accent/30 p-2 rounded-full">
                {t("hero.whatToDo")}
              </span>
              <div className="flex flex-wrap gap-2">
                {recommendationChips.map((c) => (
                  <button
                    key={c}
                    className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink/80 transition-colors hover:bg-brand-light hover:text-brand"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </AnimatePresence>
      </div>
    </section>
  );
}
