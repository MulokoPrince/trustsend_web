import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowUpDown, CheckCircle2, Loader2, Plus, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWallets } from "../../hooks/useWallets";
import { swapErrorMessage, useExecuteSwap, useSwapQuote } from "../../hooks/useSwap";
import { formatMinorUnits } from "../../lib/format";
import { ApiError } from "../../lib/api";
import { WalletLogo } from "../../components/dashboard/WalletLogo";
import { PinModal } from "../../components/dashboard/PinModal";
import type { SwapQuote, SwapResult, Wallet } from "../../types/dashboard";

const QUOTE_DEBOUNCE_MS = 450;

// Les montants de l'API sont en centièmes pour toutes les devises ; une devise sans
// décimales (XAF, RWF…) n'accepte que des unités entières.
function toMinorUnits(input: string, decimals: number): string | null {
  const allowed = Math.min(Math.max(decimals, 0), 2);
  const normalized = input.trim().replace(",", ".");
  const pattern = allowed === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{1,${allowed}})?$`);
  if (!pattern.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const minor = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0") || "0");
  return minor > 0n ? minor.toString() : null;
}

function formatRate(rate: string, locale: string): string {
  return Number(rate).toLocaleString(locale, { maximumFractionDigits: 6 });
}

function WalletPicker({
  label,
  wallets,
  value,
  onChange,
  disabledCode,
}: {
  label: string;
  wallets: Wallet[];
  value: Wallet | undefined;
  onChange: (code: string) => void;
  disabledCode?: string;
}) {
  return (
    <label className="flex min-w-0 items-center gap-2.5 rounded-full border border-surface-2 bg-white py-1.5 pl-1.5 pr-3 focus-within:border-brand">
      {value && <WalletLogo wallet={value} className="h-8 w-8" />}
      <span className="sr-only">{label}</span>
      <select
        value={value?.currency_code ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-semibold text-ink outline-none"
      >
        {wallets.map((w) => (
          <option key={w.id} value={w.currency_code} disabled={w.currency_code === disabledCode}>
            {w.currency_code}
            {w.currency?.name ? ` · ${w.currency.name}` : ""}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SwapPage() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? "en-US" : "fr-FR";
  const wallets = useWallets();
  const quoteMutation = useSwapQuote();
  const executeMutation = useExecuteSwap();

  const activeWallets = useMemo(
    () => (wallets.data ?? []).filter((w) => w.status === "active"),
    [wallets.data],
  );

  const [fromCode, setFromCode] = useState<string>("");
  const [toCode, setToCode] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [pinOpen, setPinOpen] = useState(false);
  const [result, setResult] = useState<SwapResult | null>(null);
  const [quoteNonce, setQuoteNonce] = useState(0);
  const requestId = useRef(0);

  // Portefeuilles par défaut : les deux premiers de devises différentes
  useEffect(() => {
    if (activeWallets.length < 2) return;
    if (!fromCode) setFromCode(activeWallets[0].currency_code);
    if (!toCode) setToCode(activeWallets[1].currency_code);
  }, [activeWallets, fromCode, toCode]);

  const fromWallet = activeWallets.find((w) => w.currency_code === fromCode);
  const toWallet = activeWallets.find((w) => w.currency_code === toCode);
  const minorAmount = fromWallet ? toMinorUnits(amount, fromWallet.currency?.decimals ?? 2) : null;

  // Devis recalculé à chaque changement (montant, devises) après une courte pause de saisie
  useEffect(() => {
    setQuote(null);
    setQuoteError(null);
    if (!fromCode || !toCode || fromCode === toCode || !minorAmount) return;

    const id = ++requestId.current;
    const timer = setTimeout(() => {
      quoteMutation
        .mutateAsync({ from_currency: fromCode, to_currency: toCode, amount: minorAmount })
        .then((q) => {
          if (id === requestId.current) setQuote(q);
        })
        .catch((error) => {
          if (id === requestId.current) setQuoteError(swapErrorMessage(error, t));
        });
    }, QUOTE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // quoteMutation/t sont stables pour cet usage ; les inclure relancerait le devis en boucle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCode, toCode, minorAmount, quoteNonce]);

  useEffect(() => {
    if (!quote) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [quote]);

  // Une clé d'idempotence par devis : un double clic ne rejoue jamais deux échanges
  const idempotencyKey = useMemo(() => (quote ? crypto.randomUUID() : ""), [quote]);

  const secondsLeft = quote ? Math.max(0, Math.ceil((new Date(quote.expires_at).getTime() - now) / 1000)) : 0;
  const expired = !!quote && secondsLeft === 0;
  const quoteLoading = quoteMutation.isPending && !quote && !quoteError;

  const switchCurrencies = () => {
    setFromCode(toCode);
    setToCode(fromCode);
    setNotice(null);
  };

  const selectFrom = (code: string) => {
    if (code === toCode) setToCode(fromCode);
    setFromCode(code);
    setNotice(null);
  };

  const selectTo = (code: string) => {
    if (code === fromCode) setFromCode(toCode);
    setToCode(code);
    setNotice(null);
  };

  const refreshQuote = () => {
    setNotice(null);
    setQuoteNonce((n) => n + 1);
  };

  const confirmWithPin = (pin: string) => {
    if (!quote) return;
    executeMutation.mutate(
      { quote_id: quote.quote_id, idempotency_key: idempotencyKey, pin },
      {
        onSuccess: (data) => {
          setPinOpen(false);
          setResult(data);
          setAmount("");
        },
        onError: (error) => {
          if (error instanceof ApiError && (error.status === 410 || error.status === 409)) {
            setPinOpen(false);
            setNotice(swapErrorMessage(error, t));
            executeMutation.reset();
            refreshQuote();
          }
        },
      },
    );
  };

  const startNewSwap = () => {
    setResult(null);
    executeMutation.reset();
    setNotice(null);
  };

  if (wallets.isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
      </p>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-ink">{t("dashboard.swap.title")}</h1>
      <p className="mt-1 text-muted">{t("dashboard.swap.subtitle")}</p>

      {activeWallets.length < 2 ? (
        <div className="mt-8 rounded-2xl border border-surface-2 bg-white p-6">
          <p className="text-sm text-muted">{t("dashboard.swap.needTwoWallets")}</p>
          <Link
            to="/dashboard/wallet/new"
            className="mt-4 inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <Plus size={16} /> {t("dashboard.swap.addWallet")}
          </Link>
        </div>
      ) : result ? (
        <div className="mt-8 rounded-2xl border border-surface-2 bg-white p-6">
          <div className="flex items-center gap-2.5 text-accent">
            <CheckCircle2 size={22} />
            <h2 className="font-display text-lg font-semibold text-ink">{t("dashboard.swap.successTitle")}</h2>
          </div>
          <p className="mt-3 text-sm text-ink">
            {t("dashboard.swap.successBody", {
              sent: formatMinorUnits(result.amount_in, result.from_currency),
              received: formatMinorUnits(result.amount_out, result.to_currency),
            })}
          </p>
          <p className="mt-1 text-xs text-muted">
            1 {result.from_currency} = {formatRate(result.rate, locale)} {result.to_currency} ·{" "}
            {t("dashboard.swap.reference", { id: result.transaction_id })}
          </p>
          <button
            type="button"
            onClick={startNewSwap}
            className="mt-5 inline-flex items-center gap-2 rounded bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <RefreshCw size={15} /> {t("dashboard.swap.newSwap")}
          </button>
        </div>
      ) : (
        <>
          <div className="relative mt-8 space-y-2">
            {/* ---------- Vous envoyez ---------- */}
            <div className="rounded-2xl border border-surface-2 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted">{t("dashboard.swap.youSend")}</span>
                {fromWallet && (
                  <span className="text-xs text-muted">
                    {t("dashboard.swap.balance", { amount: formatMinorUnits(fromWallet.balance, fromWallet.currency_code) })}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setNotice(null);
                  }}
                  placeholder="0"
                  aria-label={t("dashboard.swap.youSend")}
                  className="min-w-0 flex-1 bg-transparent font-display text-3xl font-bold text-ink outline-none placeholder:text-surface-2"
                />
                <div className="w-44 shrink-0 sm:w-52">
                  <WalletPicker
                    label={t("dashboard.swap.youSend")}
                    wallets={activeWallets}
                    value={fromWallet}
                    onChange={selectFrom}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={switchCurrencies}
              aria-label={t("dashboard.swap.switch")}
              title={t("dashboard.swap.switch")}
              className="absolute left-1/2 top-1/2 z-10 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-surface-2 bg-white text-muted-2 shadow-sm transition-colors hover:border-brand hover:text-brand"
            >
              <ArrowUpDown size={17} />
            </button>

            {/* ---------- Vous recevez ---------- */}
            <div className="rounded-2xl border border-surface-2 bg-surface/60 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-muted">{t("dashboard.swap.youReceive")}</span>
                {toWallet && (
                  <span className="text-xs text-muted">
                    {t("dashboard.swap.balance", { amount: formatMinorUnits(toWallet.balance, toWallet.currency_code) })}
                  </span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <p className="min-w-0 flex-1 truncate font-display text-3xl font-bold text-ink">
                  {quote ? (
                    formatMinorUnits(quote.amount_out, quote.to_currency).replace(` ${quote.to_currency}`, "")
                  ) : quoteLoading ? (
                    <Loader2 size={22} className="animate-spin text-muted" />
                  ) : (
                    <span className="text-surface-2">0</span>
                  )}
                </p>
                <div className="w-44 shrink-0 sm:w-52">
                  <WalletPicker
                    label={t("dashboard.swap.youReceive")}
                    wallets={activeWallets}
                    value={toWallet}
                    onChange={selectTo}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Détails du taux ---------- */}
          <div className="mt-4 rounded-2xl border border-surface-2 bg-white px-5 py-4 text-sm">
            {quote ? (
              <dl className="space-y-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t("dashboard.swap.rate")}</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    1 {quote.from_currency} = {formatRate(quote.rate, locale)} {quote.to_currency}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">{t("dashboard.swap.fee")}</dt>
                  <dd className="font-medium text-ink tabular-nums">
                    {quote.fee === "0" ? t("dashboard.swap.noFee") : formatMinorUnits(quote.fee, quote.fee_currency)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 pt-1">
                  {expired ? (
                    <>
                      <span className="text-amber-600">{t("dashboard.swap.rateExpired")}</span>
                      <button
                        type="button"
                        onClick={refreshQuote}
                        className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
                      >
                        <RefreshCw size={14} /> {t("dashboard.swap.refreshRate")}
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-muted">
                      {t("dashboard.swap.rateExpiresIn", { seconds: secondsLeft })}
                    </span>
                  )}
                </div>
              </dl>
            ) : quoteError ? (
              <p className="flex items-center gap-1.5 text-red-600">
                <AlertCircle size={15} /> {quoteError}
              </p>
            ) : quoteLoading ? (
              <p className="flex items-center gap-2 text-muted">
                <Loader2 size={15} className="animate-spin" /> {t("dashboard.swap.fetchingRate")}
              </p>
            ) : (
              <p className="text-muted">{t("dashboard.swap.enterAmount")}</p>
            )}
          </div>

          {notice && (
            <p className="mt-4 flex items-center gap-1.5 rounded border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
              <AlertCircle size={15} /> {notice}
            </p>
          )}

          <button
            type="button"
            disabled={!quote || expired || executeMutation.isPending}
            onClick={() => {
              executeMutation.reset();
              setPinOpen(true);
            }}
            className="mt-5 w-full rounded bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("dashboard.swap.submit")}
          </button>

          <p className="mt-4 text-xs text-muted">
            {t("dashboard.swap.rateSource")}{" "}
            <a
              href="https://www.exchangerate-api.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink"
            >
              ExchangeRate-API
            </a>
          </p>
        </>
      )}

      <PinModal
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        onConfirm={confirmWithPin}
        loading={executeMutation.isPending}
        error={executeMutation.isError ? swapErrorMessage(executeMutation.error, t) : null}
      />
    </div>
  );
}
