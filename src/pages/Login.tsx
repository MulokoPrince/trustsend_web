import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogin, loginErrorMessage } from "../hooks/useLogin";
import { AuthField } from "../components/auth/AuthField";
import "../styles/geist.css";

export function Login() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const login = useLogin();

  const update =
    (field: keyof typeof form) => (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setForm((f) => ({ ...f, [field]: value }));
    };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    login.mutate(form, {
      onSuccess: () => navigate("/dashboard"),
    });
  };

  return (
    <div className="font-geist flex min-h-dvh flex-col items-center justify-center bg-surface-2 px-4 py-6 sm:py-10">
      {/* ---------- Carte de connexion ---------- */}
      <main className="w-full max-w-[28rem] rounded-[28px] bg-white p-6 sm:p-10 min-[52rem]:max-w-[65rem]">
        <div className="grid gap-x-12 gap-y-8 min-[52rem]:grid-cols-2">
          {/* Colonne titre */}
          <div className="min-w-0">
            <Link to="/" aria-label="TrustSend" className="inline-block">
              {/* Le PNG est un carré avec beaucoup de marge blanche : on recadre sur le lockup */}
              <div className="h-9 w-28 overflow-hidden">
                <img
                  src="/assets/icons/logo.png"
                  alt="TrustSend"
                  className="h-full w-full object-cover object-[center_48%]"
                />
              </div>
            </Link>

            <h1 className="mt-6 font-display text-[2rem] leading-tight text-ink sm:text-[2.25rem]">
              {t("login.title")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-2">{t("login.subtitle")}</p>

            <Link
              to="/"
              className="-ms-3 mt-4 inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-accent transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <ArrowLeft size={16} aria-hidden className="rtl:rotate-180" />
              {t("login.backHome")}
            </Link>
          </div>

          {/* Colonne formulaire */}
          <form onSubmit={onSubmit} className="min-w-0 min-[52rem]:pt-[4.5rem]">
            <div className="space-y-6">
              <AuthField
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                required
                label={t("login.email")}
                value={form.email}
                onInput={update("email")}
              />

              <div>
                <AuthField
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  label={t("login.password")}
                  value={form.password}
                  onInput={update("password")}
                  className="pe-14"
                  trailing={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                      aria-pressed={showPassword}
                      className="absolute end-2 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
                    </button>
                  }
                />
                <a
                  href="#"
                  className="-ms-2 mt-2 inline-flex h-9 items-center rounded-full px-2 text-sm font-medium text-accent transition-colors hover:bg-brand-light"
                >
                  {t("login.forgotPassword")}
                </a>
              </div>
            </div>

            <label
              htmlFor="remember"
              className="mt-3 flex w-fit cursor-pointer select-none items-center gap-3 py-1 text-sm text-ink"
            >
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-[18px] w-[18px] cursor-pointer rounded border-black/20 accent-accent"
              />
              {t("login.rememberMe")}
            </label>

            {login.isError && (
              <p role="alert" className="mt-4 flex items-start gap-2 text-sm leading-snug text-red-700">
                <AlertCircle size={17} aria-hidden className="mt-px shrink-0" />
                {loginErrorMessage(login.error, t)}
              </p>
            )}

            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent-light/50 px-3 py-1.5 text-xs font-medium text-brand">
              <ShieldCheck size={14} aria-hidden className="shrink-0" />
              {t("login.secure")}
            </p>

            {/* Actions : secondaire au début, principale à la fin (comme Google) */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <Link
                to="/signup"
                className="-ms-3 inline-flex h-10 items-center rounded-full px-3 text-sm font-semibold text-accent transition-colors hover:bg-brand-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                {t("login.createAccount")}
              </Link>
              <button
                type="submit"
                disabled={login.isPending}
                className="ms-auto inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-brand px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {login.isPending ? t("login.submitting") : t("login.submit")}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* ---------- Pied de page hors carte ---------- */}
      <footer className="mt-4 w-full max-w-[28rem] px-2 text-xs leading-relaxed text-muted min-[52rem]:max-w-[65rem] min-[52rem]:text-end">
        {t("login.termsPrefix")}{" "}
        <a href="#" className="font-medium text-ink underline-offset-2 hover:underline">
          {t("login.terms")}
        </a>{" "}
        {t("login.and")}{" "}
        <a href="#" className="font-medium text-ink underline-offset-2 hover:underline">
          {t("login.privacy")}
        </a>
        .
      </footer>
    </div>
  );
}
