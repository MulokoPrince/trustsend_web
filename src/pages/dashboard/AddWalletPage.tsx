import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Plus, Search } from "lucide-react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useCurrencies } from "../../hooks/useCurrencies";
import { useWallets, useCreateWallet } from "../../hooks/useWallets";
import { formatMinorUnits } from "../../lib/format";
import { WalletLogo } from "../../components/dashboard/WalletLogo";

export function AddWalletPage() {
  const { t } = useTranslation();
  const currencies = useCurrencies();
  const wallets = useWallets();
  const createWallet = useCreateWallet();
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const existingCurrencies = new Set(wallets.data?.map((w) => w.currency_code));

  const visibleCurrencies = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return currencies.data ?? [];
    return (currencies.data ?? []).filter(
      (c) => c.code.toLowerCase().includes(term) || c.name.toLowerCase().includes(term),
    );
  }, [currencies.data, query]);

  const addCurrency = (currency: string) => {
    setPendingCurrency(currency);
    createWallet.mutate(currency, { onSettled: () => setPendingCurrency(null) });
  };

  return (
    <div className="max-w-4xl">
      <Link
        to="/dashboard/wallet"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-2 transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        {t("dashboard.addWallet.backToWallet")}
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold text-ink">
        {t("dashboard.addWallet.title")}
      </h1>
      <p className="mt-1 text-muted">{t("dashboard.addWallet.subtitle")}</p>

      {/* ---------- Portefeuilles déjà ajoutés ---------- */}
      <div className="mt-8">
        <h2 className="font-display font-semibold text-ink">
          {t("dashboard.addWallet.yourWallets")}{" "}
          {wallets.data && <span className="text-muted">({wallets.data.length})</span>}
        </h2>

        {wallets.isLoading ? (
          <LoadingSpinner label={t("dashboard.loading")} className="mt-4" />
        ) : wallets.isError ? (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.addWallet.walletsError")}
          </p>
        ) : wallets.data && wallets.data.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-3">
            {wallets.data.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-2xl border border-surface-2 bg-white px-4 py-3"
              >
                <WalletLogo wallet={w} className="h-8 w-8" />
                <div>
                  <p className="text-sm font-semibold text-ink">{w.currency_code}</p>
                  <p className="text-xs text-muted">{formatMinorUnits(w.balance, w.currency_code)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">{t("dashboard.addWallet.noWallets")}</p>
        )}
      </div>

      {/* ---------- Notifications ---------- */}
      {createWallet.isSuccess && createWallet.data && (
        <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-accent-light bg-accent-light/40 px-5 py-4 text-sm text-accent">
          <CheckCircle2 size={18} />
          {createWallet.data.created
            ? t("dashboard.addWallet.created", { currency: createWallet.data.wallet.currency_code })
            : t("dashboard.addWallet.alreadyExists", { currency: createWallet.data.wallet.currency_code })}
        </div>
      )}

      {createWallet.isError && (
        <p className="mt-6 flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <AlertCircle size={15} /> {t("dashboard.addWallet.createError")}
        </p>
      )}

      {/* ---------- Choix de la devise ---------- */}
      <div className="mt-10 border-t border-surface-2 pt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display font-semibold text-ink">{t("dashboard.addWallet.addCurrency")}</h2>
            <p className="mt-1 text-sm text-muted">{t("dashboard.addWallet.addCurrencySubtitle")}</p>
          </div>
          <label className="relative block sm:w-64">
            <span className="sr-only">{t("dashboard.addWallet.searchCurrency")}</span>
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("dashboard.addWallet.searchCurrency")}
              className="w-full rounded border border-surface-2 bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-brand"
            />
          </label>
        </div>

        {currencies.isLoading ? (
          <LoadingSpinner label={t("dashboard.addWallet.loadingCurrencies")} className="mt-6" />
        ) : currencies.isError ? (
          <p className="mt-6 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.addWallet.currenciesError")}
          </p>
        ) : !currencies.data?.length ? (
          <p className="mt-6 text-sm text-muted">{t("dashboard.addWallet.noCurrencies")}</p>
        ) : visibleCurrencies.length === 0 ? (
          <p className="mt-6 text-sm text-muted">{t("dashboard.addWallet.noMatch", { query: query.trim() })}</p>
        ) : (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCurrencies.map((currency) => {
              const alreadyAdded = existingCurrencies.has(currency.code);
              const isPending = pendingCurrency === currency.code && createWallet.isPending;
              return (
                <button
                  key={currency.code}
                  type="button"
                  disabled={alreadyAdded || createWallet.isPending}
                  onClick={() => addCurrency(currency.code)}
                  className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition-colors ${
                    alreadyAdded
                      ? "cursor-not-allowed border-surface-2 opacity-70"
                      : "border-surface-2 hover:border-brand hover:bg-brand-light/40 disabled:cursor-wait"
                  }`}
                >
                  <img
                    src={currency.logo_url}
                    alt=""
                    loading="lazy"
                    className="h-9 w-9 shrink-0 rounded-full border border-surface-2 object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">
                      {currency.code}
                      {currency.symbol && <span className="ml-1.5 font-normal text-muted">{currency.symbol}</span>}
                    </span>
                    <span className="block truncate text-xs text-muted">{currency.name}</span>
                  </span>
                  {alreadyAdded ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent">
                      <CheckCircle2 size={15} /> {t("dashboard.addWallet.added")}
                    </span>
                  ) : isPending ? (
                    <Loader2 size={16} className="animate-spin text-brand" />
                  ) : (
                    <Plus size={16} className="text-muted-2" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
