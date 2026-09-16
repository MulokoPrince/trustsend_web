import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, FlaskConical, X } from "lucide-react";
import { ButtonSpinner } from "../LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useSandboxFund } from "../../hooks/useSandbox";
import { ApiError } from "../../lib/api";
import { formatMinorUnits, toMinorUnits } from "../../lib/format";
import type { Wallet } from "../../types/dashboard";

/** Crédit d'argent fictif sur un portefeuille — sandbox uniquement (voir useSandboxFund). */
export function SandboxFundDialog({
  open,
  onClose,
  wallets,
}: {
  open: boolean;
  onClose: () => void;
  wallets: Wallet[];
}) {
  const { t } = useTranslation();
  const fund = useSandboxFund();
  const { reset } = fund;
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [invalid, setInvalid] = useState(false);
  const firstCurrency = wallets[0]?.currency_code ?? "";

  // Formulaire remis à zéro à chaque ouverture. Volontairement pas à chaque rafraîchissement de
  // `wallets` : un crédit réussi recharge la liste, ce qui effacerait le message de succès.
  useEffect(() => {
    if (!open) return;
    setCurrency(firstCurrency);
    setAmount("");
    setInvalid(false);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !fund.isPending) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, fund.isPending, onClose]);

  if (!open) return null;

  const selected = wallets.find((w) => w.currency_code === currency);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const minor = toMinorUnits(amount, selected?.currency?.decimals ?? 2);
    if (!selected || !minor) {
      setInvalid(true);
      return;
    }
    setInvalid(false);
    fund.mutate({ currency_code: selected.currency_code, amount: minor });
  };

  const errorMessage = fund.isError
    ? fund.error instanceof ApiError
      ? fund.error.message
      : t("login.errorGeneric")
    : invalid
      ? t("dashboard.wallet.fund.invalidAmount")
      : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
      onClick={() => !fund.isPending && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="sandbox-fund-title"
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-surface-2 bg-white p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <FlaskConical size={18} />
          </span>
          <button
            type="button"
            onClick={onClose}
            disabled={fund.isPending}
            aria-label={t("dashboard.wallet.fund.cancel")}
            className="rounded-full p-1.5 text-muted-2 transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <h2 id="sandbox-fund-title" className="mt-4 font-display text-lg font-bold text-ink">
          {t("dashboard.wallet.fund.title")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("dashboard.wallet.fund.desc")}</p>

        <label htmlFor="sandbox-fund-wallet" className="mt-5 block text-sm font-medium text-ink">
          {t("dashboard.wallet.fund.wallet")}
        </label>
        <select
          id="sandbox-fund-wallet"
          value={currency}
          disabled={fund.isPending}
          onChange={(e) => setCurrency(e.target.value)}
          className="mt-1.5 h-11 w-full rounded border border-black/15 bg-white px-3 text-sm text-ink outline-none focus:border-accent"
        >
          {wallets.map((w) => (
            <option key={w.id} value={w.currency_code}>
              {w.currency_code}
              {w.currency?.name ? ` · ${w.currency.name}` : ""}
            </option>
          ))}
        </select>

        <label htmlFor="sandbox-fund-amount" className="mt-4 block text-sm font-medium text-ink">
          {t("dashboard.wallet.fund.amount")}
        </label>
        <input
          id="sandbox-fund-amount"
          type="text"
          inputMode="decimal"
          autoFocus
          value={amount}
          disabled={fund.isPending}
          aria-invalid={invalid || undefined}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
          className="mt-1.5 h-11 w-full rounded border border-black/15 px-3 text-sm text-ink outline-none focus:border-accent"
        />

        {errorMessage && (
          <p role="alert" className="mt-4 flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <AlertCircle size={14} className="shrink-0" />
            {errorMessage}
          </p>
        )}

        {fund.isSuccess && fund.data && (
          <p role="status" className="mt-4 flex items-center gap-1.5 rounded border border-accent-light bg-accent-light/40 px-3 py-2 text-sm text-ink">
            <CheckCircle2 size={14} className="shrink-0 text-accent" />
            {t("dashboard.wallet.fund.success", {
              amount: formatMinorUnits(fund.data.amount, fund.data.currency_code),
            })}
          </p>
        )}

        <button
          type="submit"
          disabled={fund.isPending || wallets.length === 0}
          aria-busy={fund.isPending || undefined}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-brand px-6 py-3 font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {fund.isPending ? (
            <ButtonSpinner label={t("dashboard.wallet.fund.submitting")} />
          ) : (
            t("dashboard.wallet.fund.submit")
          )}
        </button>
      </form>
    </div>
  );
}
