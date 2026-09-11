import { Link } from "react-router-dom";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  CreditCard,
  FileText,
  Home,
  IdCard,
  Loader2,
  Plus,
  ScanFace,
  ShieldAlert,
  Ticket,
  Wallet,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useOverview } from "../../hooks/useOverview";
import { useWallets } from "../../hooks/useWallets";
import { useTransactions } from "../../hooks/useTransactions";
import { useKycStatus } from "../../hooks/useKyc";
import { planErrorMessage, usePlans, useSubscribePlan } from "../../hooks/usePlans";
import { getStoredBusiness } from "../../lib/session";
import { formatMinorUnits } from "../../lib/format";
import { TransactionRow } from "../../components/dashboard/TransactionRow";
import { PinModal } from "../../components/dashboard/PinModal";
import type { KycStatusData } from "../../types/dashboard";

const keyUpdates = [
  {
    icon: AlertTriangle,
    tone: "warn" as const,
    titleKey: "keyUpdate1Title",
    descKey: "keyUpdate1Desc",
  },
  {
    icon: Ticket,
    tone: "info" as const,
    titleKey: "keyUpdate2Title",
    descKey: "keyUpdate2Desc",
  },
  {
    icon: CheckCircle2,
    tone: "success" as const,
    titleKey: "keyUpdate3Title",
    descKey: "keyUpdate3Desc",
  },
];

const toneClasses = {
  warn: "bg-amber-50 text-amber-600",
  info: "bg-brand-light text-brand",
  success: "bg-accent-light text-accent",
};

const KYC_TONE = {
  not_started: {
    icon: ShieldAlert,
    iconColor: "text-brand",
    cta: "bg-brand text-white shadow-soft hover:bg-brand-dark",
  },
  pending: {
    icon: Clock3,
    iconColor: "text-amber-600",
    cta: "border border-surface-2 text-ink hover:border-brand/30",
  },
  rejected: {
    icon: XCircle,
    iconColor: "text-red-600",
    cta: "bg-red-600 text-white shadow-soft hover:bg-red-700",
  },
} as const;

// Icône représentative par type de document KYC, plutôt qu'un pictogramme
// générique répété pour chaque pièce.
function documentIcon(doc: string) {
  if (doc === "selfie") return ScanFace;
  if (doc === "proof_of_address") return Home;
  if (doc === "business_registration_certificate" || doc === "tax_identification_certificate") return Building2;
  if (
    doc.startsWith("id_card") ||
    doc === "passport" ||
    doc.startsWith("driver_license") ||
    doc.startsWith("representative_id")
  ) {
    return IdCard;
  }
  return FileText;
}

function greetingDate(locale: string) {
  return new Date().toLocaleDateString(locale.startsWith("en") ? "en-US" : "fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });
}

/** Vue affichée tant que le business n'a pas terminé son KYC (accès aux
 * routes financières bloqué côté API tant que le KYC n'est pas approuvé). */
function KycOnboardingView({ kyc }: { kyc: KycStatusData }) {
  const { t, i18n } = useTranslation();
  const business = getStoredBusiness();
  const status = kyc.status;
  const tone =
    status === "pending" ? KYC_TONE.pending : status === "rejected" ? KYC_TONE.rejected : KYC_TONE.not_started;
  const submitted = status !== "not_started";
  const reviewed = status === "approved" || status === "rejected";

  const steps = [
    { key: "accountCreated", done: true },
    { key: "kycSubmitted", done: submitted },
    { key: "kycReviewed", done: reviewed, failed: status === "rejected" },
  ];
  const completedSteps = steps.filter((s) => s.done || s.failed).length;
  const documents = "documents" in kyc ? kyc.documents : [];

  return (
    <>
      <div>
        <h1 className="font-display text-2xl font-bold text-ink">
          {t("dashboard.overview.greeting", {
            name: business?.name ?? t("dashboard.overview.yourBusiness"),
          })}
        </h1>
        <p className="mt-1 text-muted">{greetingDate(i18n.language)}</p>
      </div>

      <div className="mt-6 rounded-2xl border border-surface-2 bg-white p-6 lg:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <tone.icon size={19} className={`mt-0.5 shrink-0 ${tone.iconColor}`} />
            <div className="min-w-0">
              <h2 className="font-display text-base font-bold text-ink">
                {t(`dashboard.overview.kycOnboarding.${status}Title`)}
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted">
                {status === "rejected" && "decision_reason" in kyc && kyc.decision_reason
                  ? kyc.decision_reason
                  : t(`dashboard.overview.kycOnboarding.${status}Desc`)}
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/kyc"
            className={`inline-flex shrink-0 items-center gap-1.5 rounded px-4 py-2.5 text-sm font-semibold transition-colors ${tone.cta}`}
          >
            {t(`dashboard.overview.kycOnboarding.${status}Cta`)}
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Progression */}
        <div className="mt-6 border-t border-surface-2 pt-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">
              {t("dashboard.overview.kycOnboarding.stepsTitle")}
            </p>
            <p className="text-xs font-medium text-muted-2">
              {completedSteps}/{steps.length}
            </p>
          </div>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                status === "rejected" ? "bg-red-500" : "bg-accent"
              }`}
              style={{ width: `${(completedSteps / steps.length) * 100}%` }}
            />
          </div>

          <ul className="mt-4 space-y-2.5">
            {steps.map((step) => {
              const StepIcon = step.failed ? XCircle : step.done ? CheckCircle2 : Circle;
              return (
                <li key={step.key} className="flex items-center gap-2.5 text-sm">
                  <StepIcon
                    size={16}
                    className={`shrink-0 ${
                      step.failed ? "text-red-600" : step.done ? "text-accent" : "text-muted-2"
                    }`}
                  />
                  <span className={step.done || step.failed ? "font-medium text-ink" : "text-muted-2"}>
                    {t(`dashboard.overview.kycOnboarding.steps.${step.key}`)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {documents.length > 0 && (
          <div className="mt-6 border-t border-surface-2 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-2">
              {t("dashboard.overview.kycOnboarding.documentsTitle")}
            </p>
            <ul className="mt-3 space-y-2.5">
              {documents.map((doc) => {
                const DocIcon = documentIcon(doc);
                return (
                  <li key={doc} className="flex items-center gap-2.5 text-sm text-ink">
                    <DocIcon size={16} className="shrink-0 text-muted-2" />
                    {t(`dashboard.kyc.document.${doc}`, { defaultValue: doc })}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Aperçu de l'étape suivante (souscription) — accessible même avant
          l'approbation KYC, pour montrer où mène le parcours. */}
      <div className="mt-6">
        <PlanPrompt />
      </div>
    </>
  );
}

/** Rappel affiché sur l'Overview pour inciter à passer sur un plan payant.
 * Souscrire débite immédiatement le prix du plan depuis le wallet du
 * business — d'où la confirmation par PIN, comme pour un retrait. */
function PlanPrompt() {
  const { t } = useTranslation();
  const plans = usePlans();
  const subscribe = useSubscribePlan();
  const [expanded, setExpanded] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  useEffect(() => {
    if (subscribe.isSuccess) setPinModalOpen(false);
  }, [subscribe.isSuccess]);

  const openPinFor = (planId: number) => {
    setSelectedPlanId(planId);
    setPinModalOpen(true);
  };

  const confirmSubscribe = (pin: string) => {
    if (selectedPlanId === null) return;
    subscribe.mutate({ plan_id: selectedPlanId, pin });
  };

  const closePinModal = () => {
    setPinModalOpen(false);
    if (subscribe.isError) subscribe.reset();
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-surface-2 bg-white px-4 py-3 text-left text-sm transition-colors hover:border-brand/30"
      >
        <CreditCard size={15} className="shrink-0 text-brand" />
        <span className="font-medium text-ink">{t("dashboard.overview.planGate.bannerTitle")}</span>
        <span className="text-muted">{t("dashboard.overview.planGate.bannerDesc")}</span>
        <span className="ml-auto flex shrink-0 items-center gap-1 text-xs font-semibold text-brand">
          {expanded ? t("dashboard.overview.planGate.hide") : t("dashboard.overview.planGate.viewPlans")}
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {expanded && (
        <div className="mt-4">
          {plans.isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted">
              <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
            </p>
          ) : plans.isError ? (
            <p className="flex items-center gap-1.5 text-sm text-red-600">
              <AlertCircle size={15} /> {t("dashboard.overview.planGate.plansError")}
            </p>
          ) : plans.data && plans.data.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plans.data.map((plan) => {
                const isSubscribingThis = subscribe.isPending && selectedPlanId === plan.id;
                const grantedFeatures = Object.entries(plan.features)
                  .filter(([, granted]) => granted)
                  .map(([key]) => key);
                return (
                  <div
                    key={plan.id}
                    className="flex h-full flex-col rounded-2xl border border-surface-2 bg-white p-6"
                  >
                    <h3 className="font-display text-lg font-bold text-ink">{plan.name}</h3>
                    {plan.description && (
                      <p className="mt-1 text-sm text-muted">{plan.description}</p>
                    )}

                    <div className="mt-5">
                      <p className="font-display text-3xl font-bold text-ink">
                        {formatMinorUnits(plan.price, plan.currency_code)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {t("dashboard.overview.planGate.thenMonthly", {
                          amount: formatMinorUnits(plan.maintenance_price, plan.currency_code),
                        })}
                      </p>
                    </div>

                    {grantedFeatures.length > 0 && (
                      <ul className="mt-5 flex-1 space-y-2.5">
                        {grantedFeatures.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-ink/80">
                            <Check size={15} className="mt-0.5 shrink-0 text-accent" />
                            {t(`dashboard.overview.planGate.feature.${f}`, { defaultValue: f })}
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      onClick={() => openPinFor(plan.id)}
                      disabled={subscribe.isPending}
                      className="mt-6 flex items-center justify-center gap-1.5 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubscribingThis
                        ? t("dashboard.overview.planGate.subscribing")
                        : t("dashboard.overview.planGate.subscribe")}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted">{t("dashboard.overview.planGate.noPlans")}</p>
          )}
        </div>
      )}

      <PinModal
        open={pinModalOpen}
        onClose={closePinModal}
        onConfirm={confirmSubscribe}
        loading={subscribe.isPending}
        error={subscribe.isError ? planErrorMessage(subscribe.error, t) : null}
      />
    </div>
  );
}

export function Overview() {
  const { t, i18n } = useTranslation();
  const business = getStoredBusiness();
  const overview = useOverview();
  const wallets = useWallets();
  const txs = useTransactions(1, 5);
  const kyc = useKycStatus();
  const updatesRef = useRef<HTMLDivElement>(null);

  const scrollUpdates = (dir: 1 | -1) => {
    updatesRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  const primaryWallet = wallets.data?.[0];
  const last30 = overview.data?.last_30_days;

  if (kyc.isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
      </p>
    );
  }

  if (kyc.data && kyc.data.status !== "approved") {
    return <KycOnboardingView kyc={kyc.data} />;
  }

  return (
    <>
      <PlanPrompt />

      {/* Carte de bienvenue */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white lg:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rotate-12 rounded-[3rem] bg-white/10 blur-2xl"
        />
        <div className="relative text-center">
          <h1 className="font-display text-2xl font-bold">
            {t("dashboard.overview.greeting", {
              name: business?.name ?? t("dashboard.overview.yourBusiness"),
            })}
          </h1>
          <p className="mt-1 text-sm text-white/70">{greetingDate(i18n.language)}</p>
        </div>

        <div className="relative mt-6 grid gap-6 rounded-2xl bg-white/95 p-6 text-ink lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{t("dashboard.overview.balanceLabel")}</p>
              <Link
                to="/dashboard/wallet/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
              >
                <Plus size={14} />
                {t("dashboard.overview.addWallet")}
              </Link>
            </div>
            {wallets.isLoading ? (
              <Loader2 size={22} className="mt-3 animate-spin text-muted" />
            ) : wallets.isError ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle size={15} /> {t("dashboard.overview.balanceError")}
              </p>
            ) : primaryWallet ? (
              <>
                <p className="mt-2 flex items-center gap-2.5 font-display text-3xl font-bold text-ink lg:text-4xl">
                  {primaryWallet.flag_url && (
                    <img
                      src={primaryWallet.flag_url}
                      alt=""
                      className="h-7 w-7 shrink-0 rounded-full object-cover"
                    />
                  )}
                  {formatMinorUnits(primaryWallet.balance, primaryWallet.currency_code)}
                </p>
                {wallets.data && wallets.data.length > 1 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {wallets.data.slice(1).map((w) => (
                      <span
                        key={w.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-muted-2"
                      >
                        {w.flag_url && (
                          <img src={w.flag_url} alt="" className="h-4 w-4 rounded-full object-cover" />
                        )}
                        {formatMinorUnits(w.balance, w.currency_code)}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">
                {t("dashboard.overview.noWallet")}{" "}
                <Link to="/dashboard/wallet/new" className="font-semibold text-brand hover:text-brand-dark">
                  {t("dashboard.overview.addOne")}
                </Link>
              </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                to="/dashboard/deposit"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
              >
                <ArrowDownToLine size={15} />
                {t("dashboard.overview.deposit")}
              </Link>
              <Link
                to="/dashboard/withdraw"
                className="inline-flex items-center gap-2 rounded-full border border-surface-2 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/30"
              >
                <ArrowUpFromLine size={15} />
                {t("dashboard.overview.withdraw")}
              </Link>
            </div>
          </div>

          <div className="hidden shrink-0 items-center justify-center lg:flex">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-light">
              <Wallet size={28} className="text-brand" />
            </div>
          </div>
        </div>
      </div>

      {/* Actualités clés */}
      <div className="mt-8">
        <h2 className="font-display font-semibold text-ink">
          {t("dashboard.overview.keyUpdates")} <span className="text-muted">({keyUpdates.length})</span>
        </h2>

        <div
          ref={updatesRef}
          className="mask-fade-x mt-4 flex gap-4 overflow-x-auto scroll-smooth pb-1"
        >
          {keyUpdates.map((u) => (
            <div
              key={u.titleKey}
              className="w-72 shrink-0 rounded-2xl border border-surface-2 bg-white p-4"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full ${toneClasses[u.tone]}`}
              >
                <u.icon size={16} />
              </span>
              <p className="mt-3 text-sm font-semibold text-ink">
                {t(`dashboard.overview.${u.titleKey}`)}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {t(`dashboard.overview.${u.descKey}`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => scrollUpdates(-1)}
            aria-label={t("dashboard.overview.prev")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-2 bg-white text-muted-2 transition-colors hover:text-ink"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scrollUpdates(1)}
            aria-label={t("dashboard.overview.next")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-2 bg-white text-muted-2 transition-colors hover:text-ink"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Aperçu des paiements */}
      <div className="mt-8 rounded-2xl border border-surface-2 bg-white p-5 lg:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold text-ink">{t("dashboard.overview.paymentsOverview")}</h2>
          <span className="text-sm text-muted">{t("dashboard.overview.last30days")}</span>
        </div>

        {overview.isLoading ? (
          <Loader2 size={22} className="mt-5 animate-spin text-muted" />
        ) : overview.isError ? (
          <p className="mt-5 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.overview.overviewError")}
          </p>
        ) : (
          last30 && (
            <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium text-muted">{t("dashboard.overview.successfulDeposits")}</p>
                <p className="mt-1.5 font-display text-xl font-bold text-ink">
                  {last30.deposits.completed}
                </p>
                <span className="text-xs text-muted">{t("dashboard.overview.outOf", { total: last30.deposits.total })}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">{t("dashboard.overview.successfulWithdrawals")}</p>
                <p className="mt-1.5 font-display text-xl font-bold text-ink">
                  {last30.payouts.completed}
                </p>
                <span className="text-xs text-muted">{t("dashboard.overview.outOf", { total: last30.payouts.total })}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">{t("dashboard.overview.depositSuccessRate")}</p>
                <p className="mt-1.5 font-display text-xl font-bold text-accent">
                  {last30.deposit_success_rate_percent ?? "—"}%
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted">{t("dashboard.overview.withdrawalSuccessRate")}</p>
                <p className="mt-1.5 font-display text-xl font-bold text-accent">
                  {last30.payout_success_rate_percent ?? "—"}%
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Transactions récentes */}
      <div className="mt-6 rounded-2xl border border-surface-2 bg-white">
        <div className="flex items-center justify-between border-b border-surface-2 px-5 py-4">
          <h2 className="font-display font-semibold text-ink">{t("dashboard.overview.recentTransactions")}</h2>
          <Link
            to="/dashboard/transactions"
            className="text-sm font-semibold text-brand hover:text-brand-dark"
          >
            {t("dashboard.overview.seeAll")}
          </Link>
        </div>

        {txs.isLoading ? (
          <p className="flex items-center gap-2 px-5 py-6 text-sm text-muted">
            <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
          </p>
        ) : txs.isError ? (
          <p className="flex items-center gap-1.5 px-5 py-6 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.overview.transactionsError")}
          </p>
        ) : txs.data && txs.data.data.length > 0 ? (
          <ul className="divide-y divide-surface-2">
            {txs.data.data.map((tx) => (
              <TransactionRow key={tx.transaction_id} tx={tx} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-6 text-sm text-muted">{t("dashboard.overview.noTransactions")}</p>
        )}
      </div>
    </>
  );
}
