import type { ComponentType } from "react";
import { Link2, QrCode, Receipt, Send, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { Reveal } from "./Reveal";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  QrCode,
  Send,
  Receipt,
  Users,
};

export function NoCodeShowcase() {
  const { t } = useTranslation();
  const { noCodeExamples } = useContent();
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-ink">
            {t("noCodeShowcase.title")}
          </h2>
          <p className="mt-4 text-muted text-base sm:text-lg">
            {t("noCodeShowcase.subtitle")}
          </p>
        </Reveal>

        <div className="mt-10 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {noCodeExamples.map((ex, i) => {
            const Icon = icons[ex.icon] ?? Link2;
            return (
            <Reveal key={ex.title} delay={i * 0.08}>
              <div className="group rounded-4xl border border-surface-2 p-6 h-full hover:shadow-soft hover:border-brand/20 transition-all">
                <div className="h-11 w-11 rounded-2xl bg-brand-light flex items-center justify-center group-hover:bg-brand transition-colors">
                  <Icon size={18} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-ink">
                  {ex.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted">{ex.subtitle}</p>
                <div className="mt-4 h-2 w-3/4 rounded-full bg-surface-2" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-surface-2" />
              </div>
            </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
