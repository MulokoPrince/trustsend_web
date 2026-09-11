import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { Reveal } from "./Reveal";
import ringsPattern from "../assets/Group (1).png";

export function FeatureBlocks() {
  const { t } = useTranslation();
  const { innovationBlocks, mobileMoneyProviders } = useContent();
  return (
    <section className="relative overflow-hidden py-24 bg-surface-2">
      <img
        src={ringsPattern}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-4 hidden w-32 select-none opacity-20 lg:block lg:w-44"
      />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-sm font-semibold text-brand uppercase tracking-wide">
            {t("featureBlocks.eyebrow")}
          </span>
          <h2 className="mt-3 font-display font-bold text-3xl lg:text-4xl text-ink">
            {t("featureBlocks.title")}
          </h2>
        </Reveal>

        <div className="space-y-24">
          {innovationBlocks.map((block, i) => (
            <div
              key={block.name}
              className={`grid lg:grid-cols-2 gap-14 items-center ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal>
                <h3 className="font-display font-bold text-2xl lg:text-3xl text-ink">
                  {block.name}
                </h3>
                <p className="mt-4 text-lg text-ink/80 leading-relaxed">
                  {block.stat}
                </p>
                <p className="mt-3 text-muted">{block.description}</p>
              </Reveal>
              <Reveal delay={0.1}>
                   <img
                    // key={capIndex}
                    // initial={{ opacity: 0, y: 16 }}
                    // animate={{ opacity: 1, y: 0 }}
                    // transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    src="/src/assets/multi_device.png"
                    alt="Aperçu de l'application TrustSend"
                    className="mx-auto block aspect-[5/4] w-full select-none object-contain"
                  />
                {/* <MockupCard variant={block.variant} /> */}
              </Reveal>
            </div>
          ))}
        </div>

        <Reveal delay={0.15} className="mt-24">
          <div className="rounded-4xl border border-surface-2 bg-white px-6 py-12 text-center shadow-card lg:p-14">
            <span className="text-sm font-semibold uppercase tracking-wide text-brand">
              {t("featureBlocks.mobileMoneyEyebrow")}
            </span>
            <h3 className="mt-3 font-display text-2xl font-bold text-ink lg:text-3xl">
              {t("featureBlocks.mobileMoneyTitle")}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              {t("featureBlocks.mobileMoneyDesc")}
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {mobileMoneyProviders.map((provider) => (
                <div
                  key={provider.name}
                  className="flex h-14 w-32 items-center justify-center rounded-2xl border border-surface-2 bg-white px-5 shadow-card"
                >
                  <img
                    src={provider.src}
                    alt={provider.name}
                    className="max-h-8 max-w-full select-none object-contain"
                  />
                </div>
              ))}
            </div>

            <a
              href="#"
              className="mt-10 inline-flex items-center gap-2 rounded bg-brand px-7 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark"
            >
              {t("featureBlocks.cta")} <ArrowRight size={18} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
