import { useCallback, useState } from "react";
import { AlertCircle, ArrowRight, Wallet as WalletIcon } from "lucide-react";
import { ButtonSpinner, LoadingSpinner } from "../../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { useCreatePayout } from "../../hooks/useMobileMoney";
import { mobileMoneyErrorMessage } from "../../hooks/useMobileMoney";
import { useWallets } from "../../hooks/useWallets";
import { MobileMoneyForm, type MobileMoneyPreview } from "../../components/dashboard/MobileMoneyForm";
import { formatMinorUnits } from "../../lib/format";

const WITHDRAW_FORM_ID = "withdraw-form";

export function WithdrawPage() {
  const { t } = useTranslation();
  const payout = useCreatePayout();
  const wallets = useWallets();
  const [preview, setPreview] = useState<MobileMoneyPreview | null>(null);
  const onSelectionChange = useCallback((p: MobileMoneyPreview) => setPreview(p), []);

  const remainingBalance =
    preview?.wallet && preview.requestedMinorAmount !== null
      ? Number(preview.wallet.balance) - preview.requestedMinorAmount
      : null;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">{t("dashboard.withdraw.title")}</h1>
      <p className="mt-1 text-muted">
        {t("dashboard.withdraw.subtitle")}
      </p>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-ink">{t("dashboard.withdraw.yourWallets")}</h2>

        {wallets.isLoading ? (
          <LoadingSpinner label={t("dashboard.withdraw.walletsLoading")} className="mt-3" />
        ) : wallets.isError ? (
          <p className="mt-3 flex items-center gap-1.5 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.withdraw.walletsError")}
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
          <p className="mt-3 text-sm text-muted">{t("dashboard.withdraw.noWallets")}</p>
        )}
      </div>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
        <MobileMoneyForm
          operation="PAYOUT"
          mutation={payout}
          submitLabel={t("dashboard.withdraw.submit")}
          pendingLabel={t("dashboard.withdraw.submitting")}
          wallets={wallets.data}
          onSelectionChange={onSelectionChange}
          formId={WITHDRAW_FORM_ID}
          hideSubmitButton
        />

        <div className="flex flex-col rounded-2xl border border-surface-2 bg-white p-6 lg:sticky lg:top-6">
          <h2 className="font-display text-base font-bold text-ink">
            {t("dashboard.withdraw.previewTitle")}
          </h2>

          {!preview?.currencyCode ? (
            <p className="mt-3 text-sm text-muted">{t("dashboard.withdraw.previewEmpty")}</p>
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
                  <dt className="text-muted">{t("dashboard.withdraw.previewBalance")}</dt>
                  <dd className="font-semibold text-ink">
                    {preview.wallet ? formatMinorUnits(preview.wallet.balance, preview.currencyCode) : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">{t("dashboard.withdraw.previewAmount")}</dt>
                  <dd className="font-semibold text-ink">
                    {preview.requestedMinorAmount !== null
                      ? formatMinorUnits(String(preview.requestedMinorAmount), preview.currencyCode)
                      : "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-surface-2 pt-2.5">
                  <dt className="text-muted">{t("dashboard.withdraw.previewRemaining")}</dt>
                  <dd className={`font-semibold ${preview.insufficientBalance ? "text-red-600" : "text-ink"}`}>
                    {remainingBalance !== null
                      ? formatMinorUnits(String(remainingBalance), preview.currencyCode)
                      : "—"}
                  </dd>
                </div>
              </dl>

              {preview.insufficientBalance && (
                <p className="flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  <AlertCircle size={13} />
                  {preview.wallet
                    ? t("dashboard.mobileMoneyForm.insufficientBalanceWarning")
                    : t("dashboard.mobileMoneyForm.noWalletForCurrency")}
                </p>
              )}

              <div className="flex-1" />
            </div>
          )}

          {payout.isError && (
            <p className="mt-4 flex items-center gap-1.5 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              <AlertCircle size={13} />
              {mobileMoneyErrorMessage(payout.error, t)}
            </p>
          )}

          <button
            type="submit"
            form={WITHDRAW_FORM_ID}
            disabled={payout.isPending || payout.isSuccess || !preview?.canSubmit}
            aria-busy={payout.isPending || undefined}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded bg-accent px-6 py-3.5 font-semibold text-white shadow-soft transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {payout.isPending ? (
              <ButtonSpinner label={t("dashboard.withdraw.submitting")} />
            ) : (
              <>
                {t("dashboard.withdraw.submit")}
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
