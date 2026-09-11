import type { ComponentType } from "react";
import { motion } from "framer-motion";
import { Percent, Phone, Receipt, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { Reveal } from "./Reveal";
import heroAsset from "../assets/hero.png";
import loopPattern from "../assets/Group (2).png";

const icons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  Wallet,
  Percent,
  Receipt,
  Smartphone,
  Phone,
  ShieldCheck,
};

export function PlatformStandards() {
  const { t } = useTranslation();
  const { platformStandards } = useContent();
  return (
    <section className="relative overflow-hidden py-24">
      <motion.img
        src={heroAsset}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 hidden w-40 select-none opacity-25 drop-shadow-[0_20px_50px_rgba(124,58,237,0.35)] lg:block lg:w-56"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <img
        src={loopPattern}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 hidden w-72 select-none opacity-20 lg:block"
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-brand">
            {t("platformStandards.eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink lg:text-4xl">
            {t("platformStandards.title")}
          </h2>
          <p className="mt-4 text-lg text-muted">
            {t("platformStandards.subtitle")}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {platformStandards.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <Reveal key={item.label} delay={i * 0.05}>
                <div className="group flex flex-col items-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-light transition-colors group-hover:bg-brand">
                    <Icon size={20} className="text-brand transition-colors group-hover:text-white" />
                  </div>
                  <p className="mt-4 font-display text-base font-semibold leading-snug text-ink">
                    {item.label}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
