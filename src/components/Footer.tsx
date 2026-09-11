import { Camera, Code2, Globe, MessageCircle, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { Link } from "react-router-dom";

const socials = [
  { icon: Users, label: "Facebook" },
  { icon: MessageCircle, label: "Twitter" },
  { icon: Globe, label: "LinkedIn" },
  { icon: Camera, label: "Instagram" },
  { icon: Code2, label: "Github" },
];

export function Footer() {
  const { t } = useTranslation();
  const { footerColumns } = useContent();
  return (
    <footer className="pt-20 pb-8 bg-surface border-t border-surface-2">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10">
          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-wide text-ink mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href="#"
                      className="text-sm text-muted hover:text-brand transition-colors inline-flex items-center gap-1.5"
                    >
                      {link.label}
                      {link.badge && (
                        <span className="text-[10px] font-bold text-accent bg-accent-light/50 px-1.5 py-0.5 rounded">
                          {link.badge}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-surface-2 pt-8">
          <div className="flex items-center gap-2">
             <Link
          to="/"
          className="flex shrink-0 items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4"
        >
          <img src="/assets/icons/logo.png" alt="TrustSend" className="h-46 w-auto" />
        </Link>
           </div>

          <div className="flex items-center gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="h-9 w-9 rounded-full bg-white border border-surface-2 flex items-center justify-center text-muted hover:text-brand hover:border-brand/30 transition-colors"
              >
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted leading-relaxed">
          <p>{t("footer.legal")}</p>
          <p className="mt-2">
            © 2026 TrustSend. {t("footer.rights")} ·{" "}
            <a href="#" className="hover:text-brand">{t("footer.terms")}</a> ·{" "}
            <a href="#" className="hover:text-brand">{t("footer.privacy")}</a> ·{" "}
            <a href="#" className="hover:text-brand">{t("footer.responsibleDisclosure")}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
