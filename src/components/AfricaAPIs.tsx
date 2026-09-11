import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import africaCardImg from "../assets/africa_card.png";

export function AfricaAPIs() {
  const { t } = useTranslation();

  return (
    <section
      id="africa-apis"
      aria-label={t("africaAPIs.title")}
      className="bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Content */}
          <div className="max-w-xl">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                {t("africaAPIs.title")}
              </h2>

              <p className="mt-5 max-w-lg text-base leading-7 text-muted sm:text-lg">
                {t("africaAPIs.subtitle")}
              </p>

              <p className="mt-6 text-sm leading-7 text-muted-2 sm:text-base">
                {t("africaAPIs.description")}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#developers"
                  className="group inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  {t("africaAPIs.ctaDocs")}

                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </a>

                <a
                  href="/contact"
                  className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  {t("africaAPIs.ctaContact")}
                </a>
              </div>
            </Reveal>
          </div>

          {/* Africa Coverage */}
          <Reveal delay={0.1}>
            <div className="flex justify-center lg:justify-end">
              <img
                src={africaCardImg}
                alt="TrustSend Pan-African APIs Coverage Map"
                className="w-full max-w-[360px] object-contain sm:max-w-[420px]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}