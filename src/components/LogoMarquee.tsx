import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";

export function LogoMarquee() {
  const { t } = useTranslation();
  const { mobileMoneyProviders } = useContent();
  const loop = [...mobileMoneyProviders, ...mobileMoneyProviders];

  return (
    <section className="border-y border-surface-2 bg-surface py-10">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wide text-muted">
        {t("logoMarquee.title")}
      </p>
      <div className="mask-fade-x overflow-hidden">
        <div className="flex w-max animate-marquee items-center">
          {loop.map((provider, i) => (
            <div
              key={`${provider.name}-${i}`}
              className="mx-3 flex h-16 w-36 shrink-0 items-center justify-center rounded-2xl border border-surface-2 bg-white px-6 shadow-card"
            >
              <img
                src={provider.src}
                alt={provider.name}
                className="max-h-8 max-w-full select-none object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
