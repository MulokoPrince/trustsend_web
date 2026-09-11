import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { useLogin, loginErrorMessage } from "../hooks/useLogin";
import loginBg from "../assets/loginbg.png";
import "../styles/geist.css";

const inputClasses =
  "h-12 w-full rounded border border-black/10 bg-white px-4 text-[15px] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition duration-200 placeholder:text-muted/60 hover:border-black/20 focus:border-accent focus:ring-4 focus:ring-accent/15";

const labelClasses = "block text-[13px] font-medium text-ink";

export function Login() {
  const { t } = useTranslation();
  const { mobileMoneyProviders } = useContent();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const login = useLogin();
  const marqueeProviders = [...mobileMoneyProviders, ...mobileMoneyProviders];

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
    <div className="font-geist flex min-h-dvh bg-white">
      {/* ---------- Colonne visuelle (desktop) ---------- */}
      <div className="relative hidden overflow-hidden bg-brand lg:block lg:w-[52%] xl:w-[55%]">
        <img
          src={loginBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full select-none object-cover"
        />
        {/* Le dégradé ancre le texte en bas sans noyer l'image en haut */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand via-brand/80 via-40% to-brand/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand/40 to-transparent" />

        <div className="relative flex h-full flex-col justify-end gap-12 p-12 xl:p-16">
          <blockquote className="max-w-lg">
            <span
              aria-hidden
              className="block font-serif text-6xl leading-none text-white/25"
            >
              &ldquo;
            </span>
            <p className="-mt-4 font-serif text-[26px] font-medium italic leading-[1.35] text-white xl:text-[30px]">
              {t("login.quote")}
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-white/40" />
              <span className="text-[13px] font-semibold tracking-wide text-white/75">
                {t("login.quoteAttribution")}
              </span>
            </footer>
          </blockquote>

          {/* Preuve : moyens de paiement compatibles */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
              {t("logoMarquee.title")}
            </p>
            <div className="mask-fade-x mt-4 overflow-hidden">
              <div className="flex w-max animate-marquee items-center gap-2.5 hover:[animation-play-state:paused]">
                {marqueeProviders.map((provider, i) => (
                  <div
                    key={`${provider.name}-${i}`}
                    className="flex h-11 w-24 shrink-0 items-center justify-center rounded-xl bg-white/95 px-3 ring-1 ring-white/20"
                  >
                    <img
                      src={provider.src}
                      alt={provider.name}
                      loading="lazy"
                      className="max-h-5 max-w-full select-none object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Colonne formulaire ---------- */}
      <div className="flex w-full flex-col px-6 py-6 sm:px-10 lg:w-[48%] lg:px-14 lg:py-8 xl:w-[45%] xl:px-20">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" aria-label="TrustSend" className="shrink-0">
            {/* Le PNG est un carré avec beaucoup de marge blanche : on recadre sur le lockup */}
            <div className="h-9 w-28 overflow-hidden">
              <img
                src="/assets/icons/logo.png"
                alt="TrustSend"
                className="h-full w-full object-cover object-[center_48%]"
              />
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ArrowLeft size={15} aria-hidden />
            {t("login.backHome")}
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center py-10 lg:py-12">
          <div className="mx-auto w-full max-w-[400px]">
            <h1 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[34px]">
              {t("login.title")}
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {t("login.subtitle")}
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="email" className={labelClasses}>
                  {t("login.email")}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                  required
                  value={form.email}
                  onInput={update("email")}
                  placeholder={t("login.emailPlaceholder")}
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor="password" className={labelClasses}>
                    {t("login.password")}
                  </label>
                  <a
                    href="#"
                    className="text-[13px] font-medium text-accent underline-offset-2 hover:underline"
                  >
                    {t("login.forgotPassword")}
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onInput={update("password")}
                    placeholder="••••••••"
                    className={`${inputClasses} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword
                        ? t("login.hidePassword")
                        : t("login.showPassword")
                    }
                    aria-pressed={showPassword}
                    className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {showPassword ? (
                      <EyeOff size={17} aria-hidden />
                    ) : (
                      <Eye size={17} aria-hidden />
                    )}
                  </button>
                </div>
              </div>

              <label
                htmlFor="remember"
                className="flex w-fit cursor-pointer select-none items-center gap-2.5 py-1 text-sm text-muted"
              >
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 cursor-pointer rounded border-black/20 accent-accent"
                />
                {t("login.rememberMe")}
              </label>

              {login.isError && (
                <p
                  role="alert"
                  className="flex items-start gap-2.5 px-3.5 py-3 text-sm leading-snug text-red-700"
                >
                  <AlertCircle size={17} aria-hidden className="mt-px shrink-0" />
                  {loginErrorMessage(login.error, t)}
                </p>
              )}

              <button
                type="submit"
                disabled={login.isPending}
                className="group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded bg-brand px-6 text-[15px] font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-dark active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
              >
                {login.isPending ? t("login.submitting") : t("login.submit")}
                {!login.isPending && (
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-muted">
                <ShieldCheck size={14} aria-hidden className="text-accent" />
                {t("login.secure")}
              </p>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <span aria-hidden className="h-px flex-1 bg-black/[0.08]" />
              <span className="text-xs text-muted">
                {t("login.noAccount")}
              </span>
              <span aria-hidden className="h-px flex-1 bg-black/[0.08]" />
            </div>

            <Link
              to="/signup"
              className="mt-4 flex h-12 w-full items-center justify-center rounded border border-black/10 bg-white px-6 text-[15px] font-semibold text-ink transition-colors hover:border-black/20 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t("login.createAccount")}
            </Link>
          </div>
        </main>

        <footer className="mx-auto w-full max-w-[400px] text-center text-xs leading-relaxed text-muted">
          {t("login.termsPrefix")}{" "}
          <a
            href="#"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            {t("login.terms")}
          </a>{" "}
          {t("login.and")}{" "}
          <a
            href="#"
            className="font-medium text-ink underline-offset-2 hover:underline"
          >
            {t("login.privacy")}
          </a>
          .
        </footer>
      </div>
    </div>
  );
}
