import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useContent } from "../hooks/useContent";
import { useSignup, useRequestSignupOtp } from "../hooks/useSignup";
import { ApiError } from "../lib/api";
import loginBg from "../assets/loginbg.png";
import "../styles/geist.css";

const inputClasses =
  "h-12 w-full rounded border border-black/10 bg-white px-4 text-[15px] text-ink shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition duration-200 placeholder:text-muted/60 hover:border-black/20 focus:border-accent focus:ring-4 focus:ring-accent/15";

const labelClasses = "block text-[13px] font-medium text-ink";

const primaryButtonClasses =
  "group flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded bg-brand px-6 text-[15px] font-semibold text-white shadow-soft transition-all duration-200 hover:bg-brand-dark active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const ghostButtonClasses =
  "inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-surface hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const OTP_LENGTH = 6;

const STEPS = ["email", "otp", "details"] as const;
type Step = (typeof STEPS)[number];

export function Signup() {
  const { t } = useTranslation();
  const { mobileMoneyProviders } = useContent();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpFocused, setOtpFocused] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "", code: "" });
  const requestOtp = useRequestSignupOtp();
  const signup = useSignup();
  const otpInputRef = useRef<HTMLInputElement>(null);
  const marqueeProviders = [...mobileMoneyProviders, ...mobileMoneyProviders];

  const stepIndex = STEPS.indexOf(step);

  const otpInvalid =
    signup.isError && signup.error instanceof ApiError && signup.error.status === 400;

  useEffect(() => {
    if (step === "otp") {
      const id = requestAnimationFrame(() => otpInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [step]);

  // Un code invalide/expiré n'est détecté qu'à la soumission finale (l'API ne l'expose pas
  // séparément) — on ramène l'utilisateur à l'étape du code pour qu'il le corrige en contexte.
  useEffect(() => {
    if (otpInvalid && step !== "otp") setStep("otp");
  }, [otpInvalid, step]);

  const update =
    (field: keyof typeof form) => (e: FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setForm((f) => ({ ...f, [field]: value }));
    };

  const onRequestOtp = (e: FormEvent) => {
    e.preventDefault();
    requestOtp.mutate(
      { email },
      { onSuccess: () => setStep("otp") },
    );
  };

  const onChangeEmail = () => {
    setStep("email");
    requestOtp.reset();
    signup.reset();
    setOtp("");
  };

  const onOtpChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
    setOtp(digits);
  };

  const onContinueFromOtp = () => {
    if (otp.length !== OTP_LENGTH) return;
    if (signup.isError) signup.reset();
    setStep("details");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    signup.mutate({
      name: form.name,
      email,
      otp,
      phone: form.phone,
      password: form.password,
      ...(form.code ? { code: form.code } : {}),
    });
  };

  const errorMessage = (error: unknown) =>
    error instanceof ApiError ? error.message : t("login.errorGeneric");

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
              {t("signup.quote")}
            </p>
            <footer className="mt-6 flex items-center gap-3">
              <span aria-hidden className="h-px w-8 bg-white/40" />
              <span className="text-[13px] font-semibold tracking-wide text-white/75">
                {t("signup.quoteAttribution")}
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
            {signup.isSuccess ? (
              /* ---------- Confirmation ---------- */
              <div className="text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-light/60">
                  <CheckCircle2 size={28} aria-hidden className="text-accent" />
                </span>
                <h1 className="mt-5 font-display text-[28px] font-semibold leading-tight tracking-[-0.025em] text-ink">
                  {t("signup.successCreated")}
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">
                  {t("signup.successPendingBody", {
                    name: signup.data.name,
                    email: signup.data.email,
                  })}
                </p>
                <Link
                  to="/login"
                  className={`${primaryButtonClasses} mt-8`}
                >
                  {t("signup.backToLogin")}
                  <ArrowRight
                    size={17}
                    aria-hidden
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            ) : (
              <>
                {/* ---------- Progression ---------- */}
                <div className="mb-7">
                  <div aria-hidden className="flex items-center gap-1.5">
                    {STEPS.map((s, i) => (
                      <span
                        key={s}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                          i <= stepIndex ? "bg-brand" : "bg-black/[0.08]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    {t("signup.stepOf", {
                      current: stepIndex + 1,
                      total: STEPS.length,
                    })}
                  </p>
                </div>

                {/* ---------- Étape 1 : email ---------- */}
                {step === "email" && (
                  <>
                    <h1 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[34px]">
                      {t("signup.title")}
                    </h1>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {t("signup.subtitle")}
                    </p>

                    <form onSubmit={onRequestOtp} className="mt-8 space-y-5">
                      <div className="space-y-1.5">
                        <label htmlFor="email" className={labelClasses}>
                          {t("signup.email")}
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          autoFocus
                          required
                          value={email}
                          onInput={(e) => setEmail(e.currentTarget.value)}
                          placeholder={t("login.emailPlaceholder")}
                          className={inputClasses}
                        />
                      </div>

                      {requestOtp.isError && (
                        <p
                          role="alert"
                          className="flex items-start gap-2.5 rounded px-3.5 py-3 text-sm leading-snug text-red-700"
                        >
                          <AlertCircle size={17} aria-hidden className="mt-px shrink-0" />
                          {errorMessage(requestOtp.error)}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={requestOtp.isPending}
                        className={primaryButtonClasses}
                      >
                        {requestOtp.isPending
                          ? t("signup.sendingCode")
                          : t("signup.sendCode")}
                        {!requestOtp.isPending && (
                          <ArrowRight
                            size={17}
                            aria-hidden
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        )}
                      </button>
                    </form>
                  </>
                )}

                {/* ---------- Étape 2 : code de vérification ---------- */}
                {step === "otp" && (
                  <>
                    <h1 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[34px]">
                      {t("signup.verifyTitle")}
                    </h1>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {t("signup.verifySubtitle", { email })}{" "}
                      <button
                        type="button"
                        onClick={onChangeEmail}
                        className="cursor-pointer font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      >
                        {t("signup.changeEmail")}
                      </button>
                    </p>

                    <div className="mt-8">
                      <label htmlFor="otp" className={labelClasses}>
                        {t("signup.otpLabel")}
                      </label>
                      <div className="relative mt-2">
                        <input
                          ref={otpInputRef}
                          id="otp"
                          name="otp"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          aria-label={t("signup.otpLabel")}
                          aria-invalid={otpInvalid || undefined}
                          value={otp}
                          onChange={onOtpChange}
                          onFocus={() => setOtpFocused(true)}
                          onBlur={() => setOtpFocused(false)}
                          onKeyDown={(e) => e.key === "Enter" && onContinueFromOtp()}
                          className="absolute inset-0 z-10 h-12 w-full cursor-pointer opacity-0"
                        />
                        <div aria-hidden className="flex items-center gap-2">
                          {Array.from({ length: OTP_LENGTH }).map((_, i) => {
                            const filled = i < otp.length;
                            const active = otpFocused && i === Math.min(otp.length, OTP_LENGTH - 1);
                            return (
                              <span
                                key={i}
                                className={`flex h-12 w-full items-center justify-center rounded-xl border text-lg font-semibold tabular-nums transition duration-150 ${
                                  otpInvalid
                                    ? "border-red-300 bg-red-50 text-red-700"
                                    : active
                                      ? "border-accent bg-white text-ink ring-4 ring-accent/15"
                                      : filled
                                        ? "border-black/20 bg-surface text-ink"
                                        : "border-black/10 text-transparent"
                                }`}
                              >
                                {otp[i] ?? ""}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => requestOtp.mutate({ email })}
                        disabled={requestOtp.isPending}
                        className="mt-3 cursor-pointer text-[13px] font-medium text-accent underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:text-muted disabled:no-underline"
                      >
                        {requestOtp.isPending
                          ? t("signup.sendingCode")
                          : requestOtp.isSuccess
                            ? t("signup.resendOtpSent")
                            : t("signup.resendOtp")}
                      </button>

                      {otpInvalid && (
                        <p
                          role="alert"
                          className="mt-5 flex items-start gap-2.5  px-3.5 py-3 text-sm leading-snug text-red-700"
                        >
                          <AlertCircle size={17} aria-hidden className="mt-px shrink-0" />
                          {errorMessage(signup.error)}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={onContinueFromOtp}
                        disabled={otp.length !== OTP_LENGTH}
                        className={`${primaryButtonClasses} mt-6`}
                      >
                        {t("signup.continue")}
                        <ArrowRight
                          size={17}
                          aria-hidden
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </button>

                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={onChangeEmail}
                          className={ghostButtonClasses}
                        >
                          <ArrowLeft size={15} aria-hidden />
                          {t("signup.back")}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ---------- Étape 3 : informations du compte ---------- */}
                {step === "details" && (
                  <>
                    <h1 className="font-display text-[30px] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-[34px]">
                      {t("signup.detailsTitle")}
                    </h1>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {t("signup.detailsSubtitle")}
                    </p>

                    <form onSubmit={onSubmit} className="mt-8 space-y-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className={labelClasses}>
                          {t("signup.companyName")}
                        </label>
                        <input
                          id="name"
                          name="organization"
                          type="text"
                          autoComplete="organization"
                          autoFocus
                          required
                          value={form.name}
                          onInput={update("name")}
                          placeholder={t("signup.companyNamePlaceholder")}
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="phone" className={labelClasses}>
                          {t("signup.phone")}
                        </label>
                        <input
                          id="phone"
                          name="tel"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          required
                          value={form.phone}
                          onInput={update("phone")}
                          placeholder="260763456789"
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="code" className={labelClasses}>
                          {t("signup.code")}{" "}
                          <span className="font-normal text-muted">
                            {t("signup.codeOptional")}
                          </span>
                        </label>
                        <input
                          id="code"
                          name="code"
                          type="text"
                          value={form.code}
                          onInput={update("code")}
                          placeholder={t("signup.codePlaceholder")}
                          className={inputClasses}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="password" className={labelClasses}>
                          {t("signup.password")}
                        </label>
                        <div className="relative">
                          <input
                            id="password"
                            name="new-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            required
                            minLength={8}
                            aria-describedby="password-hint"
                            value={form.password}
                            onInput={update("password")}
                            placeholder={t("signup.passwordPlaceholder")}
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
                        <p id="password-hint" className="text-xs text-muted">
                          {t("signup.passwordPlaceholder")}
                        </p>
                      </div>

                      <label
                        htmlFor="terms"
                        className="flex cursor-pointer select-none items-start gap-2.5 rounded-xl bg-surface p-3.5 text-sm leading-relaxed text-muted"
                      >
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-black/20 accent-accent"
                        />
                        <span>
                          {t("signup.acceptTerms")}{" "}
                          <a
                            href="#"
                            className="font-medium text-ink underline-offset-2 hover:underline"
                          >
                            {t("login.terms")}
                          </a>{" "}
                          {t("signup.and")}{" "}
                          <a
                            href="#"
                            className="font-medium text-ink underline-offset-2 hover:underline"
                          >
                            {t("login.privacy")}
                          </a>{" "}
                          {t("signup.termsSuffix")}
                        </span>
                      </label>

                      {signup.isError && !otpInvalid && (
                        <p
                          role="alert"
                          className="flex items-start gap-2.5  px-3.5 py-3 text-sm leading-snug text-red-700"
                        >
                          <AlertCircle size={17} aria-hidden className="mt-px shrink-0" />
                          {errorMessage(signup.error)}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={signup.isPending}
                        className={primaryButtonClasses}
                      >
                        {signup.isPending ? t("signup.submitting") : t("signup.submit")}
                        {!signup.isPending && (
                          <ArrowRight
                            size={17}
                            aria-hidden
                            className="transition-transform duration-200 group-hover:translate-x-0.5"
                          />
                        )}
                      </button>

                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={() => setStep("otp")}
                          className={ghostButtonClasses}
                        >
                          <ArrowLeft size={15} aria-hidden />
                          {t("signup.back")}
                        </button>
                      </div>
                    </form>
                  </>
                )}

                <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
                  <ShieldCheck size={14} aria-hidden className="text-accent" />
                  {t("login.secure")}
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <span aria-hidden className="h-px flex-1 bg-black/[0.08]" />
                  <span className="text-xs text-muted">{t("signup.haveAccount")}</span>
                  <span aria-hidden className="h-px flex-1 bg-black/[0.08]" />
                </div>

                <Link
                  to="/login"
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-black/10 bg-white px-6 text-[15px] font-semibold text-ink transition-colors hover:border-black/20 hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t("signup.login")}
                </Link>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
