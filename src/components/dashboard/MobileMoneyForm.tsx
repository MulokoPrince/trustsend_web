import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Info, Loader2 } from "lucide-react";
import type { UseMutationResult } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { ImageSelect } from "./ImageSelect";
import type { MobileMoneyPayload } from "../../hooks/useMobileMoney";
import { mobileMoneyErrorMessage } from "../../hooks/useMobileMoney";
import { decimalsCount, type MobileMoneyOperation } from "../../types/paymentMethods";
import type { MobileMoneyOperationResult, Wallet } from "../../types/dashboard";
import { formatMinorUnits } from "../../lib/format";
import { LiveStatusCheck } from "./LiveStatusCheck";
import { PinModal } from "./PinModal";

export interface MobileMoneyPreview {
  wallet?: Wallet;
  currencyCode: string;
  countryLabel?: string;
  providerLabel?: string;
  amount: string;
  requestedMinorAmount: number | null;
  insufficientBalance: boolean;
  canSubmit: boolean;
}

const inputClasses =
  "w-full rounded-md border border-surface-2 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-shadow duration-150 placeholder:text-muted-2 focus:border-ink focus:ring-4 focus:ring-ink/[0.08] disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60";

const selectClasses = inputClasses;

function newIdempotencyKey() {
  return crypto.randomUUID();
}

export function MobileMoneyForm({
  operation,
  mutation,
  submitLabel,
  pendingLabel,
  wallets,
  onSelectionChange,
  formId,
  hideSubmitButton = false,
}: {
  operation: MobileMoneyOperation;
  mutation: UseMutationResult<MobileMoneyOperationResult, unknown, MobileMoneyPayload>;
  submitLabel: string;
  pendingLabel: string;
  wallets?: Wallet[];
  onSelectionChange?: (preview: MobileMoneyPreview) => void;
  formId?: string;
  hideSubmitButton?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "fr";
  const methods = usePaymentMethods();
  const [countryCode, setCountryCode] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [providerCode, setProviderCode] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [idempotencyKey, setIdempotencyKey] = useState(newIdempotencyKey);
  const [pinModalOpen, setPinModalOpen] = useState(false);

  const countries = methods.data?.active_configuration?.countries ?? [];
  const country = countries.find((c) => c.country === countryCode);

  const currencies = useMemo(() => {
    if (!country) return [];
    const seen = new Map<string, string>();
    for (const p of country.providers) {
      for (const c of p.currencies) {
        if (c.operationTypes[operation]?.status === "OPERATIONAL") {
          seen.set(c.currency, c.displayName);
        }
      }
    }
    return Array.from(seen, ([currency, displayName]) => ({ currency, displayName }));
  }, [country, operation]);

  const providers = useMemo(() => {
    if (!country || !currencyCode) return [];
    return country.providers.filter((p) =>
      p.currencies.some(
        (c) => c.currency === currencyCode && c.operationTypes[operation]?.status === "OPERATIONAL",
      ),
    );
  }, [country, currencyCode, operation]);

  const countryOptions = useMemo(
    () => countries.map((c) => ({ value: c.country, label: c.displayName[lang], image: c.flag })),
    [countries, lang],
  );

  const providerOptions = useMemo(
    () => providers.map((p) => ({ value: p.provider, label: p.displayName, image: p.logo })),
    [providers],
  );

  const activeConfig = useMemo(() => {
    const provider = providers.find((p) => p.provider === providerCode);
    const currency = provider?.currencies.find((c) => c.currency === currencyCode);
    return currency?.operationTypes[operation] ?? null;
  }, [providers, providerCode, currencyCode, operation]);

  const selectedWallet = useMemo(
    () => wallets?.find((w) => w.currency_code === currencyCode),
    [wallets, currencyCode],
  );

  const requestedMinorAmount = useMemo(() => {
    if (!activeConfig || !amount) return null;
    const decimals = decimalsCount(activeConfig.decimalsInAmount);
    return Math.round(Number(amount) * 10 ** decimals);
  }, [activeConfig, amount]);

  const insufficientBalance =
    operation === "PAYOUT" &&
    !!wallets &&
    !!currencyCode &&
    requestedMinorAmount !== null &&
    (!selectedWallet || requestedMinorAmount > Number(selectedWallet.balance));

  const providerLabel = providerOptions.find((p) => p.value === providerCode)?.label;
  const canSubmit = !!activeConfig && !insufficientBalance;

  useEffect(() => {
    onSelectionChange?.({
      wallet: selectedWallet,
      currencyCode,
      countryLabel: country?.displayName[lang],
      providerLabel,
      amount,
      requestedMinorAmount,
      insufficientBalance,
      canSubmit,
    });
  }, [
    selectedWallet,
    currencyCode,
    country,
    lang,
    providerLabel,
    amount,
    requestedMinorAmount,
    insufficientBalance,
    canSubmit,
    onSelectionChange,
  ]);

  const onCountryChange = (value: string) => {
    setCountryCode(value);
    setCurrencyCode("");
    setProviderCode("");
  };

  const onCurrencyChange = (value: string) => {
    setCurrencyCode(value);
    setProviderCode("");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || requestedMinorAmount === null) return;
    setPinModalOpen(true);
  };

  const confirmWithPin = (pin: string) => {
    if (requestedMinorAmount === null) return;
    mutation.mutate({
      amount: String(requestedMinorAmount),
      currency_code: currencyCode,
      phone_number: phone,
      provider: providerCode,
      idempotency_key: idempotencyKey,
      pin,
    });
  };

  const closePinModal = () => {
    setPinModalOpen(false);
    if (mutation.isError) mutation.reset();
  };

  const reset = () => {
    setCountryCode("");
    setCurrencyCode("");
    setProviderCode("");
    setPhone("");
    setAmount("");
    setPinModalOpen(false);
    setIdempotencyKey(newIdempotencyKey());
    mutation.reset();
  };

  if (mutation.isSuccess) {
    return (
      <div className="rounded-2xl border border-surface-2 bg-white p-6 text-center">
        <CheckCircle2 size={36} className="mx-auto text-accent" />
        <p className="mt-3 font-display text-lg font-semibold text-ink">{t("dashboard.mobileMoneyForm.success")}</p>
        <p className="mt-1 text-sm text-muted">
          {t("dashboard.mobileMoneyForm.status")} : <span className="font-semibold text-ink">{mutation.data.status}</span>
          {" · "}{t("dashboard.mobileMoneyForm.reference")}{" "}
          <span className="font-semibold text-ink">
            #{mutation.data.deposit_id ?? mutation.data.payout_id}
          </span>
        </p>
        <button
          onClick={reset}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-surface-2 px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-brand/30"
        >
          {t("dashboard.mobileMoneyForm.newOperation")}
        </button>

        <LiveStatusCheck
          kind={operation === "DEPOSIT" ? "deposits" : "payouts"}
          id={(mutation.data.deposit_id ?? mutation.data.payout_id)!}
        />
      </div>
    );
  }

  if (methods.isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("dashboard.mobileMoneyForm.loadingMethods")}
      </p>
    );
  }

  if (methods.isError) {
    return (
      <p className="flex items-center gap-1.5 text-sm text-red-600">
        <AlertCircle size={15} /> {t("dashboard.mobileMoneyForm.methodsError")}
      </p>
    );
  }

  return (
    <>
      <form
        id={formId}
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-surface-2 bg-white p-6"
      >
      <div>
        <label className="mb-2 block text-sm font-medium text-ink" htmlFor="country">
          {t("dashboard.mobileMoneyForm.country")}
        </label>
        <ImageSelect
          id="country"
          options={countryOptions}
          value={countryCode}
          onChange={onCountryChange}
          placeholder={t("dashboard.mobileMoneyForm.countryPlaceholder")}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink" htmlFor="currency">
          {t("dashboard.mobileMoneyForm.currency")}
        </label>
        <select
          id="currency"
          required
          disabled={!country}
          value={currencyCode}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className={selectClasses}
        >
          <option value="">{t("dashboard.mobileMoneyForm.currencyPlaceholder")}</option>
          {currencies.map((c) => (
            <option key={c.currency} value={c.currency}>
              {c.displayName} ({c.currency})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink" htmlFor="provider">
          {t("dashboard.mobileMoneyForm.provider")}
        </label>
        <ImageSelect
          id="provider"
          options={providerOptions}
          value={providerCode}
          onChange={setProviderCode}
          placeholder={t("dashboard.mobileMoneyForm.providerPlaceholder")}
          disabled={!currencyCode}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink" htmlFor="phone">
          {t("dashboard.mobileMoneyForm.phone")}
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={phone}
          onInput={(e) => setPhone(e.currentTarget.value.replace(/[^0-9]/g, ""))}
          placeholder={country ? `${country.prefix}...` : "260763456789"}
          className={inputClasses}
        />
        {country && (
          <p className="mt-1 text-xs text-muted">
            {t("dashboard.mobileMoneyForm.prefix", { country: country.displayName[lang], prefix: country.prefix })}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink" htmlFor="amount">
          {t("dashboard.mobileMoneyForm.amount")}
        </label>
        <input
          id="amount"
          type="number"
          min="0"
          step="any"
          required
          disabled={!activeConfig}
          value={amount}
          onInput={(e) => setAmount(e.currentTarget.value)}
          placeholder="100"
          className={selectClasses}
        />
        {activeConfig && (
          <p className="mt-1 text-xs text-muted">
            {t("dashboard.mobileMoneyForm.amountRange", {
              min: activeConfig.minAmount,
              max: activeConfig.maxAmount,
              currency: currencyCode,
            })}
          </p>
        )}
        {operation === "PAYOUT" && wallets && currencyCode && (
          <p className={`mt-1 text-xs ${insufficientBalance ? "text-red-600" : "text-muted"}`}>
            {selectedWallet
              ? t("dashboard.mobileMoneyForm.availableBalance", {
                  balance: formatMinorUnits(selectedWallet.balance, selectedWallet.currency_code),
                })
              : t("dashboard.mobileMoneyForm.noWalletForCurrency")}
          </p>
        )}
      </div>

      {activeConfig && (
        <p className="flex items-start gap-1.5 text-xs text-muted-2">
          <Info size={13} className="mt-0.5 shrink-0" />
          {t("dashboard.mobileMoneyForm.operatorFeesNotice")}
        </p>
      )}

      {insufficientBalance && amount && (
        <p className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle size={15} />
          {selectedWallet
            ? t("dashboard.mobileMoneyForm.insufficientBalanceWarning")
            : t("dashboard.mobileMoneyForm.noWalletForCurrency")}
        </p>
      )}

      {!hideSubmitButton && (
        <button
          type="submit"
          disabled={mutation.isPending || !canSubmit}
          className="group flex w-full items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mutation.isPending ? pendingLabel : submitLabel}
          {!mutation.isPending && (
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </button>
      )}
    </form>

      <PinModal
        open={pinModalOpen}
        onClose={closePinModal}
        onConfirm={confirmWithPin}
        loading={mutation.isPending}
        error={mutation.isError ? mobileMoneyErrorMessage(mutation.error, t) : null}
      />
    </>
  );
}
