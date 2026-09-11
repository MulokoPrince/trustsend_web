import { Check, Globe, MapPin, Smartphone } from "lucide-react";
import { Reveal } from "./Reveal";

const tiers = [
  {
    level: 1,
    name: "International",
    icon: Globe,
    tagline: "Couverture la plus large, tous moyens de paiement inclus.",
    price: "100",
    maintenance: "2",
    featured: true,
    cta: "Choisir le niveau 1",
    features: [
      "Afrique de l'Est & International",
      "Paiement en crypto-monnaies",
      "Mobile Money",
      "Cartes virtuelles",
    ],
  },
  {
    level: 2,
    name: "Régional",
    icon: MapPin,
    tagline: "Trois marchés d'Afrique de l'Est, une seule intégration.",
    price: "50",
    maintenance: "1",
    featured: false,
    cta: "Choisir le niveau 2",
    features: [
      "Disponible en RD Congo",
      "Disponible en Tanzanie",
      "Disponible au Rwanda",
    ],
  },
  {
    level: 3,
    name: "Mobile Money RDC",
    icon: Smartphone,
    tagline: "Le point d'entrée le plus rapide pour un premier lancement.",
    price: "30",
    maintenance: "1",
    featured: false,
    cta: "Choisir le niveau 3",
    features: ["Mobile Money RDC", "Intégration rapide", "Idéal pour démarrer"],
  },
];

export function PricingPlans() {
  return (
    <>
      {/* ---------- Header ---------- */}
      <section className="relative overflow-hidden bg-surface-2 pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Reveal>
            <span className="text-sm font-semibold tracking-wide text-brand">
              Tarification API
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-balance text-ink lg:text-4xl">
              Frais d'installation API
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              Un frais unique selon votre marché, réglé une seule fois lors de
              l'intégration à votre plateforme.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto w-full max-w-[620px] lg:max-w-[660px]">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-light opacity-70 blur-3xl"
              />
              <img
                src="/assets/home/pg-graphic.png"
                alt="Passerelle de paiement TrustSend connectée aux différents moyens de paiement"
                width={1020}
                height={960}
                loading="eager"
                decoding="async"
                // className="mx-auto block h-auto w-full max-w-full select-none object-contain"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Cards ---------- */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {tiers.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <Reveal key={tier.level} delay={i * 0.06} className="h-full">
                  <div
                    className={[
                      "relative flex h-full flex-col rounded-2xl bg-white p-8",
                      tier.featured
                        ? "border border-brand/30 shadow-[0_20px_50px_-24px_rgb(0_0_0/0.28)] lg:-mt-4 lg:pb-10 lg:pt-10"
                        : "border border-surface-2",
                    ].join(" ")}
                  >
                    {tier.featured && (
                      <span className="absolute -top-3 left-8 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                        Couverture complète
                      </span>
                    )}

                    {/* En-tête */}
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                          tier.featured
                            ? "bg-brand text-white"
                            : "bg-brand-light text-brand",
                        ].join(" ")}
                      >
                        <Icon size={20} strokeWidth={2} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-muted">
                          Niveau {tier.level}
                        </p>
                        <h3 className="font-display text-xl font-bold leading-tight text-ink">
                          {tier.name}
                        </h3>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {tier.tagline}
                    </p>

                    {/* Prix */}
                    <div className="mt-7 rounded-xl bg-surface-2/60 p-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display text-4xl font-bold tracking-tight text-ink">
                          ${tier.price}
                        </span>
                        <span className="text-sm font-medium text-muted">
                          USD, une seule fois
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        Puis{" "}
                        <span className="font-semibold text-ink">
                          ${tier.maintenance} USD par mois
                        </span>{" "}
                        de maintenance.
                      </p>
                    </div>

                    {/* Inclus */}
                    <p className="mt-7 text-sm font-semibold text-ink">
                      Ce niveau comprend
                    </p>
                    <ul className="mt-4 flex-1 space-y-3.5">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check
                            size={16}
                            strokeWidth={2.5}
                            className="mt-0.5 shrink-0 text-brand"
                            aria-hidden
                          />
                          <span className="text-sm leading-relaxed text-ink/80">
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#"
                      className={[
                        "mt-8 flex items-center justify-center rounded-lg px-5 py-3 font-semibold transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
                        tier.featured
                          ? "bg-brand text-white hover:bg-brand/90"
                          : "border border-surface-2 text-ink hover:border-brand hover:text-brand",
                      ].join(" ")}
                    >
                      {tier.cta}
                    </a>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <p className="mx-auto max-w-lg text-center text-sm leading-relaxed text-muted">
              Les frais de maintenance couvrent le support et le fonctionnement
              continu de votre intégration API.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}