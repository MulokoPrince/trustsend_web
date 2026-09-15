import { useCallback, useState } from "react";
import { AlertCircle, ArrowRight, Wallet as WalletIcon } from "lucide-react";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useCreateDeposit } from "../../hooks/useMobileMoney";
import { mobileMoneyErrorMessage } from "../../hooks/useMobileMoney";
import { useWallets } from "../../hooks/useWallets";
import { MobileMoneyForm, type MobileMoneyPreview } from "../../components/dashboard/MobileMoneyForm";
import { formatMinorUnits } from "../../lib/format";

const DEPOSIT_FORM_ID = "deposit-form";

export function DepositPage() {
  const { t } = useTranslation();
  const deposit = useCreateDeposit();
  const wallets = useWallets();
  const [preview, setPreview] = useState<MobileMoneyPreview | null>(null);
  const onSelectionChange = useCallback((p: MobileMoneyPreview) => setPreview(p), []);

  const balanceAfter =
    preview?.requestedMinorAmount !== null && preview?.requestedMinorAmount !== undefined
      ? Number(preview.wallet?.balance ?? 0) + preview.requestedMinorAmount
      : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">{t("dashboard.deposit.title")}</h1>
      <p className="mt-1 text-muted">
        {t("dashboard.deposit.subtitle")}
      </p>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-ink">{t("dashboard.deposit.yourWallets")}</h2>

        {wallets.isLoading ? (
          <LoadingSpinner label={t("dashboard.deposit.walletsLoading")} className="mt-3" />
        ) : wallets.isError ? (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.deposit.walletsError")}
          </p>
        ) : wallets.data && wallets.data.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-3">
            {wallets.data.map((w) => (
              <div
                key={w.id}
                className="flex items-center gap-3 rounded-xl border border-surface-2 bg-white px-4 py-3"
              >
                {w.flag_url ? (
                  <img src={w.flag_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                ) : (
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                    <WalletIcon size={16} />
                  </span>
                )}
                <div>
                  <p className="text-xs text-muted">{w.currency_code}</p>
                  <p className="font-display text-sm font-bold text-ink">
                    {formatMinorUnits(w.balance, w.currency_code)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">{t("dashboard.deposit.noWallets")}</p>
        )}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <MobileMoneyForm
          operation="DEPOSIT"
          mutation={deposit}
          submitLabel={t("dashboard.deposit.submit")}
          pendingLabel={t("dashboard.deposit.submitting")}
          onSelectionChange={onSelectionChange}
          formId={DEPOSIT_FORM_ID}
          hideSubmitButton
        />

        <div className="flex flex-col rounded-2xl border border-surface-2 bg-white p-6 lg:sticky lg:top-6">
          <h2 className="font-display text-base font-bold text-ink">
            {t("dashboard.deposit.previewTitle")}
          </h2>

          {!preview?.currencyCode ? (
            <p className="mt-3 text-sm text-muted">{t("dashboard.deposit.previewEmpty")}</p>
          ) : (
            <div className="mt-4 flex flex-1 flex-col space-y-4">
              <div className="flex items-center gap-3">
                {preview.wallet?.flag_url ? (
                  <img
                    src={preview.wallet.flag_url}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-brand">
                    <WalletIcon size={18} />
                  </span>
                )}
                <div>
                  <p className="font-display text-lg font-bold text-ink">{preview.currencyCode}</p>
                  {(preview.countryLabel || preview.providerLabel) && (
                    <p className="text-xs text-muted">
                      {[preview.countryLabel, preview.providerLabel].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </div>

              <dl className="space-y-2.5 border-t border-surface-2 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">{t("dashboard.deposit.previewBalance")}</dt>
                  <dd className="font-semibold text-ink">
                    {preview.wallet
                      ? formatMinorUnits(preview.wallet.balance, preview.currencyCode)
                      : formatMinorUnits("0", preview.currencyCode)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">{t("dashboard.deposit.previewAmount")}</dt>
                  <dd className="font-semibold text-ink">
                    {preview.requestedMinorAmount !== null
                      ? formatMinorUnits(String(preview.requestedMinorAmount), preview.currencyCode)
                      : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-surface-2 pt-2.5">
                  <dt className="text-muted">{t("dashboard.deposit.previewAfter")}</dt>
                  <dd className="font-semibold text-accent">
                    {balanceAfter !== null ? formatMinorUnits(String(balanceAfter), preview.currencyCode) : "—"}
                  </dd>
                </div>
              </dl>

              {!preview.wallet && (
                <p className="flex items-center gap-1.5 rounded border border-surface-2 bg-surface px-3 py-2 text-xs text-muted-2">
                  <AlertCircle size={13} className="shrink-0" />
                  {t("dashboard.deposit.newWalletNotice")}
                </p>
              )}

              <div className="flex-1" />
            </div>
          )}

          {deposit.isError && (
            <p className="mt-4 flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle size={13} />
              {mobileMoneyErrorMessage(deposit.error, t)}
            </p>
          )}

          <button
            type="submit"
            form={DEPOSIT_FORM_ID}
            disabled={deposit.isPending || deposit.isSuccess || !preview?.canSubmit}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded bg-brand px-6 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deposit.isPending ? t("dashboard.deposit.submitting") : t("dashboard.deposit.submit")}
            {!deposit.isPending && (
              <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
