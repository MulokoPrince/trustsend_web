import type { ComponentType } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Code,
  Download,
  FileText,
  Link2,
  QrCode,
  Repeat,
  Store,
  Users,
} from "lucide-react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { CookieConsent } from "../components/CookieConsent";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { Reveal } from "../components/Reveal";
import { useContent } from "../hooks/useContent";
import { businessUrl } from "../lib/domains";
import arcAsset from "../assets/Group (1).png";
import loopPattern from "../assets/Group (2).png";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  QrCode,
  Link2,
  Store,
  FileText,
  Repeat,
  Code,
  BarChart3,
  Users,
  Download,
  Bell,
};

export function Merchant() {
  const { merchantPage, mobileMoneyProviders, paymentMethods } = useContent();
  const { hero, channels, qr, steps, manage, fees, testimonial, faq, cta } =
    merchantPage;

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
                src={hero.photo}
                alt="Commerçant encaissant une vente depuis son téléphone"
                width={1600}
                height={1067}
                loading="eager"
                decoding="async"
                className="mx-auto block aspect-[3/2] w-full select-none rounded-4xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* ================================================= CHANNELS ===== */}
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
                {channels.title}
              </h2>
              <p className="mt-4 text-lg text-muted">{channels.subtitle}</p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {channels.items.map((item, i) => {
                const Icon = icons[item.icon] ?? QrCode;
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

        {/* ======================================================= QR ===== */}
        <section className="pb-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <img
                  src={qr.photo}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-5xl object-cover"
                />
              </Reveal>

              <Reveal delay={0.1}>
                <span className="text-sm font-semibold tracking-wide text-brand">
                  {qr.eyebrow}
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                  {qr.title}
                </h2>
                <p className="mt-4 text-lg text-muted">{qr.desc}</p>

                <ol className="mt-8 space-y-5">
                  {qr.items.map((item, i) => (
                    <li key={item.title} className="flex gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand font-display text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-display font-semibold text-ink">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-muted">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ==================================================== STEPS ===== */}
        <section className="relative overflow-hidden bg-surface py-24">
          <img
            src={arcAsset}
            alt=""
            aria-hidden
            className="pointer-events-none absolute right-0 top-16 hidden w-24 select-none opacity-80 lg:block"
          />

          <div className="relative mx-auto max-w-5xl px-6">
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

        {/* =================================================== MANAGE ===== */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <span className="text-sm font-semibold tracking-wide text-brand">
                  {manage.eyebrow}
                </span>
                <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
                  {manage.title}
                </h2>
                <p className="mt-4 text-lg text-muted">{manage.desc}</p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  {manage.items.map((item) => {
                    const Icon = icons[item.icon] ?? BarChart3;
                    return (
                      <div key={item.title}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-light">
                          <Icon size={17} className="text-brand" />
                        </div>
                        <p className="mt-3 font-display font-semibold text-ink">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <img
                  src={manage.photo}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-5xl object-cover"
                />
              </Reveal>
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
                  {[...mobileMoneyProviders, ...paymentMethods].map((p) => (
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

        {/* ============================================== TESTIMONIAL ===== */}
        <section className="px-6 pb-24">
          <Reveal className="mx-auto max-w-6xl">
            <div className="grid overflow-hidden rounded-5xl bg-brand lg:grid-cols-[1.2fr_1fr]">
              <div className="p-8 lg:p-14">
                <img
                  src="/assets/home/top-quotation.svg"
                  alt=""
                  aria-hidden
                  className="h-8 w-8 opacity-70"
                />
                <p className="mt-5 font-display text-2xl font-semibold leading-snug text-white lg:text-3xl">
                  {testimonial.quote}
                </p>
                <p className="mt-6 font-semibold text-white">{testimonial.name}</p>
                <p className="text-sm text-white/70">{testimonial.role}</p>
              </div>

              <img
                src={testimonial.photo}
                alt=""
                aria-hidden
                loading="lazy"
                className="h-full min-h-[240px] w-full object-cover"
              />
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
                  href={businessUrl("/signup")}
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
