import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Reveal } from "./Reveal";

export function CTABanner() {
  const { t } = useTranslation();
  return (
    <section className="px-6">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-5xl bg-brand px-8 py-16 lg:py-20 text-center">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10" />
          <h2 className="relative font-display font-bold text-3xl lg:text-4xl text-white max-w-2xl mx-auto">
            {t("ctaBanner.title")}
          </h2>
          <p className="relative mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            {t("ctaBanner.subtitle")}
          </p>
          <a
            href="#"
            className="relative mt-8 inline-flex items-center gap-2 bg-white text-brand font-semibold px-7 py-3.5 rounded-full hover:bg-white/90 transition-colors"
          >
            {t("ctaBanner.cta")} <ArrowRight size={18} />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
