import {
  useEffect,
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  AlertCircle,
  Briefcase,
  Calendar,
  Check,
  CheckCircle2,
  Copy,
  Hash,
  KeyRound,
  Loader2,
  Phone,
  ShieldCheck,
  UserRound,
  Webhook as WebhookIcon,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
  useSetPin,
  useChangePin,
} from "../../hooks/useProfile";
import { ApiError } from "../../lib/api";
import "../../styles/geist.css";

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  id: string;
  label: string;
  icon?: LucideIcon;
  onValue: (value: string) => void;
};

function Field({ id, label, icon: Icon, onValue, ...input }: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink"
      >
        {Icon && <Icon size={13} className="text-muted" />}
        {label}
      </label>
      <input
        id={id}
        onChange={(e) => onValue(e.currentTarget.value)}
        className="w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 hover:border-black/20 focus:border-brand focus:ring-4 focus:ring-brand-light"
        {...input}
      />
    </div>
  );
}

function PinField(props: Omit<FieldProps, "type" | "inputMode">) {
  return (
    <Field
      type="password"
      inputMode="numeric"
      required
      minLength={4}
      maxLength={6}
      placeholder="••••"
      {...props}
      onValue={(v) => props.onValue(v.replace(/\D/g, ""))}
    />
  );
}

function Alert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <p
      className={`flex items-center gap-2 rounded-lg border px-3.5 py-2.5 text-sm ${
        tone === "error"
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-accent-light bg-accent-light/40 text-accent"
      }`}
    >
      <Icon size={15} className="shrink-0" />
      {children}
    </p>
  );
}

function Card({
  icon: Icon,
  title,
  description,
  badge,
  warn,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  badge?: ReactNode;
  warn?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-white p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
              warn ? "bg-amber-100 text-amber-600" : "bg-brand-light text-brand"
            }`}
          >
            <Icon size={16} />
          </span>
          <div>
            <h2 className="font-display font-semibold text-ink">{title}</h2>
            {description && <p className="text-xs text-muted">{description}</p>}
          </div>
        </div>
        {badge}
      </div>
      {children}
    </section>
  );
}

function SubmitButton({
  pending,
  variant = "primary",
  children,
}: {
  pending: boolean;
  variant?: "primary" | "ghost";
  children: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
        variant === "primary"
          ? "bg-brand text-white hover:bg-brand-dark"
          : "border border-black/10 text-ink hover:border-black/20"
      }`}
    >
      {pending && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

const STATUS_KEYS: Record<string, string> = {
  active: "statusActive",
  pending: "statusPending",
  suspended: "statusSuspended",
};

const errorText = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

export function ProfilePage() {
  const { t } = useTranslation();
  const profile = useProfile();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const setPin = useSetPin();
  const changePin = useChangePin();

  const [tab, setTab] = useState<"general" | "security">("general");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", webhook_url: "" });
  const [pw, setPw] = useState({ current_password: "", new_password: "" });
  const [pin, setPinForm] = useState({ current: "", next: "", confirm: "" });
  const [pinMismatch, setPinMismatch] = useState(false);

  useEffect(() => {
    if (!profile.data) return;
    setForm({
      name: profile.data.name,
      phone: profile.data.phone,
      webhook_url: profile.data.webhook_url ?? "",
    });
  }, [profile.data]);

  if (profile.isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("dashboard.profile.loading")}
      </p>
    );
  }

  if (profile.isError || !profile.data) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-red-600">
        <AlertCircle size={15} /> {t("dashboard.profile.error")}
      </p>
    );
  }

  const account = profile.data;
  const pinSet = account.pin_set;
  const pinMutation = pinSet ? changePin : setPin;

  const initials = account.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const copyCode = () =>
    navigator.clipboard.writeText(account.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });

  const onSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      name: form.name,
      phone: form.phone,
      webhook_url: form.webhook_url || undefined,
    });
  };

  const onSavePassword = (e: FormEvent) => {
    e.preventDefault();
    changePassword.mutate(pw, {
      onSuccess: () => setPw({ current_password: "", new_password: "" }),
    });
  };

  const onSavePin = (e: FormEvent) => {
    e.preventDefault();
    if (pin.next !== pin.confirm) {
      setPinMismatch(true);
      return;
    }
    setPinMismatch(false);
    const reset = { onSuccess: () => setPinForm({ current: "", next: "", confirm: "" }) };
    if (pinSet) {
      changePin.mutate({ current_pin: pin.current, new_pin: pin.next }, reset);
    } else {
      setPin.mutate(pin.next, reset);
    }
  };

  const tabs = [
    { key: "general" as const, label: t("dashboard.profile.general"), icon: UserRound },
    { key: "security" as const, label: t("dashboard.profile.security"), icon: ShieldCheck },
  ];

  return (
    <div className="font-geist max-w-3xl">
      {/* ---------- En-tête ---------- */}
      <header className="relative overflow-hidden rounded-xl bg-[#020D30] px-6 py-8 sm:px-9">
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 font-display text-xl font-bold text-white">
              {initials}
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{account.name}</h1>
              <p className="mt-1 text-sm text-white/60">{account.email}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-white/60">
                <button
                  type="button"
                  onClick={copyCode}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-medium text-white/80 transition-colors hover:bg-white/10"
                >
                  <Hash size={12} />
                  {account.code}
                  {copied ? <Check size={12} className="text-accent-light" /> : <Copy size={12} />}
                </button>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  {t("dashboard.profile.memberSince", {
                    year: new Date(account.created_at).getFullYear(),
                  })}
                </span>
              </div>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-accent-light px-3.5 py-1.5 text-xs font-semibold text-accent sm:self-center">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t(`dashboard.profile.${STATUS_KEYS[account.status] ?? "statusActive"}`)}
          </span>
        </div>
      </header>

      {/* ---------- Onglets ---------- */}
      <nav className="mt-6 flex gap-1 border-b border-black/10">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
              tab === item.key
                ? "border-brand text-ink"
                : "border-transparent text-muted-2 hover:text-ink"
            }`}
          >
            <item.icon size={15} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* ---------- Contenu ---------- */}
      <div className="mt-6 space-y-6">
        {tab === "general" && (
          <Card icon={Briefcase} title={t("dashboard.profile.accountInfo")}>
            <form onSubmit={onSaveProfile} className="mt-6 space-y-4">
              <Field
                id="name"
                label={t("dashboard.profile.companyName")}
                required
                value={form.name}
                onValue={(name) => setForm((f) => ({ ...f, name }))}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  id="phone"
                  type="tel"
                  icon={Phone}
                  label={t("dashboard.profile.phone")}
                  required
                  value={form.phone}
                  onValue={(phone) => setForm((f) => ({ ...f, phone }))}
                />
                <Field
                  id="webhook_url"
                  type="url"
                  icon={WebhookIcon}
                  label={t("dashboard.profile.webhookUrl")}
                  placeholder="https://maboutique.com/hook"
                  value={form.webhook_url}
                  onValue={(webhook_url) => setForm((f) => ({ ...f, webhook_url }))}
                />
              </div>

              <p className="text-xs text-muted">{t("dashboard.profile.emailLocked")}</p>

              {updateProfile.isError && (
                <Alert tone="error">{t("dashboard.profile.updateError")}</Alert>
              )}
              {updateProfile.isSuccess && (
                <Alert tone="success">{t("dashboard.profile.updateSuccess")}</Alert>
              )}

              <SubmitButton pending={updateProfile.isPending}>
                {updateProfile.isPending
                  ? t("dashboard.profile.saving")
                  : t("dashboard.profile.save")}
              </SubmitButton>
            </form>
          </Card>
        )}

        {tab === "security" && (
          <>
            <Card
              icon={ShieldCheck}
              warn={!pinSet}
              title={t("dashboard.profile.pinTitle")}
              description={
                pinSet
                  ? t("dashboard.profile.pinDescSet")
                  : t("dashboard.profile.pinDescNotSet")
              }
              badge={
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    pinSet ? "bg-accent-light text-accent" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {pinSet
                    ? t("dashboard.profile.pinConfigured")
                    : t("dashboard.profile.pinNotConfigured")}
                </span>
              }
            >
              <form onSubmit={onSavePin} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {pinSet && (
                    <PinField
                      id="current_pin"
                      label={t("dashboard.profile.currentPinLabel")}
                      value={pin.current}
                      onValue={(current) => setPinForm((p) => ({ ...p, current }))}
                    />
                  )}
                  <PinField
                    id="new_pin"
                    label={t("dashboard.profile.newPinLabel")}
                    value={pin.next}
                    onValue={(next) => setPinForm((p) => ({ ...p, next }))}
                  />
                  <PinField
                    id="confirm_pin"
                    label={t("dashboard.profile.confirmPinLabel")}
                    value={pin.confirm}
                    onValue={(confirm) => setPinForm((p) => ({ ...p, confirm }))}
                  />
                </div>

                {pinMismatch && <Alert tone="error">{t("dashboard.profile.pinMismatch")}</Alert>}
                {pinMutation.isError && (
                  <Alert tone="error">
                    {errorText(pinMutation.error, t("dashboard.profile.updateError"))}
                  </Alert>
                )}
                {pinMutation.isSuccess && (
                  <Alert tone="success">
                    {pinSet
                      ? t("dashboard.profile.pinChangeSuccess")
                      : t("dashboard.profile.pinSetSuccess")}
                  </Alert>
                )}

                <SubmitButton pending={pinMutation.isPending} variant={pinSet ? "ghost" : "primary"}>
                  {pinSet
                    ? pinMutation.isPending
                      ? t("dashboard.profile.changingPin")
                      : t("dashboard.profile.changePin")
                    : pinMutation.isPending
                      ? t("dashboard.profile.settingPin")
                      : t("dashboard.profile.setPin")}
                </SubmitButton>
              </form>
            </Card>

            <Card icon={KeyRound} title={t("dashboard.profile.changePassword")}>
              <form onSubmit={onSavePassword} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="current_password"
                    type="password"
                    label={t("dashboard.profile.currentPassword")}
                    required
                    value={pw.current_password}
                    onValue={(current_password) => setPw((f) => ({ ...f, current_password }))}
                  />
                  <Field
                    id="new_password"
                    type="password"
                    label={t("dashboard.profile.newPassword")}
                    required
                    minLength={8}
                    value={pw.new_password}
                    onValue={(new_password) => setPw((f) => ({ ...f, new_password }))}
                  />
                </div>

                {changePassword.isError && (
                  <Alert tone="error">{t("dashboard.profile.passwordError")}</Alert>
                )}
                {changePassword.isSuccess && (
                  <Alert tone="success">{t("dashboard.profile.passwordSuccess")}</Alert>
                )}

                <SubmitButton pending={changePassword.isPending} variant="ghost">
                  {changePassword.isPending
                    ? t("dashboard.profile.changingPassword")
                    : t("dashboard.profile.changePasswordSubmit")}
                </SubmitButton>
              </form>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}