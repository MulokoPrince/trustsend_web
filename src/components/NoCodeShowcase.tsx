import { Link2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { Reveal } from "./Reveal";

export function NoCodeShowcase() {
  const { t } = useTranslation();
  const { noCodeExamples } = useContent();
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-ink">
            {t("noCodeShowcase.title")}
          </h2>
          <p className="mt-4 text-muted text-lg">
            {t("noCodeShowcase.subtitle")}
          </p>
        </Reveal>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {noCodeExamples.map((ex, i) => (
            <Reveal key={ex.title} delay={i * 0.08}>
              <div className="group rounded-4xl border border-surface-2 p-6 h-full hover:shadow-soft hover:border-brand/20 transition-all">
                <div className="h-11 w-11 rounded-2xl bg-brand-light flex items-center justify-center group-hover:bg-brand transition-colors">
                  <Link2 size={18} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-ink">
                  {ex.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{ex.subtitle}</p>
                <div className="mt-4 h-2 w-3/4 rounded-full bg-surface-2" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-surface-2" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
