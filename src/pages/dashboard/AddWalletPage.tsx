import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Plus, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";
import { useWallets, useCreateWallet } from "../../hooks/useWallets";
import { formatMinorUnits } from "../../lib/format";

export function AddWalletPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "fr";
  const methods = usePaymentMethods();
  const wallets = useWallets();
  const createWallet = useCreateWallet();
  const [pendingCurrency, setPendingCurrency] = useState<string | null>(null);

  const existingCurrencies = new Set(wallets.data?.map((w) => w.currency_code));

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
      <p className="mt-1 text-muted">
        {t("dashboard.addWallet.subtitle")}
      </p>

      {/* ---------- Portefeuilles déjà ajoutés ---------- */}
      <div className="mt-8">
        <h2 className="font-display font-semibold text-ink">
          {t("dashboard.addWallet.yourWallets")}{" "}
          {wallets.data && <span className="text-muted">({wallets.data.length})</span>}
        </h2>

        {wallets.isLoading ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
          </p>
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
                {w.flag_url ? (
                  <img src={w.flag_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand">
                    <Wallet size={15} />
                  </span>
                )}
                <div>
                  <p className="text-sm font-semibold text-ink">{w.currency_code}</p>
                  <p className="text-xs text-muted">
                    {formatMinorUnits(w.balance, w.currency_code)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            {t("dashboard.addWallet.noWallets")}
          </p>
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

      {/* ---------- Sélection pays / devise ---------- */}
      <div className="mt-10 border-t border-surface-2 pt-8">
        <h2 className="font-display font-semibold text-ink">{t("dashboard.addWallet.addCurrency")}</h2>
        <p className="mt-1 text-sm text-muted">
          {t("dashboard.addWallet.addCurrencySubtitle")}
        </p>

        {methods.isLoading ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <Loader2 size={16} className="animate-spin" /> {t("dashboard.addWallet.loadingCountries")}
          </p>
        ) : methods.isError ? (
          <p className="mt-6 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.addWallet.countriesError")}
          </p>
        ) : !methods.data?.active_configuration?.countries?.length ? (
          <p className="mt-6 text-sm text-muted">{t("dashboard.addWallet.noProviders")}</p>
        ) : (
          <div className="mt-6 space-y-4">
            {methods.data.active_configuration.countries.map((country) => {
              const currencies = Array.from(
                new Map(
                  country.providers.flatMap((p) =>
                    p.currencies.map((c) => [c.currency, c.displayName] as const),
                  ),
                ),
              );
              return (
                <div
                  key={country.country}
                  className="rounded-2xl border border-surface-2 bg-white p-5"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={country.flag}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-full object-cover"
                    />
                    <h3 className="font-display font-semibold text-ink">
                      {country.displayName[lang]}
                    </h3>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {currencies.map(([currency, displayName]) => {
                      const alreadyAdded = existingCurrencies.has(currency);
                      const isPending =
                        pendingCurrency === currency && createWallet.isPending;
                      return (
                        <button
                          key={currency}
                          type="button"
                          disabled={alreadyAdded || createWallet.isPending}
                          onClick={() => addCurrency(currency)}
                          title={displayName}
                          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                            alreadyAdded
                              ? "cursor-not-allowed border-surface-2 bg-surface text-accent"
                              : "border-surface-2 text-ink hover:border-brand hover:bg-brand-light hover:text-brand"
                          }`}
                        >
                          {alreadyAdded ? (
                            <CheckCircle2 size={15} />
                          ) : isPending ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Plus size={15} />
                          )}
                          {currency}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
