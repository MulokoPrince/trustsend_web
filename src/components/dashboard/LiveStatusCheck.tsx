import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  useLiveStatus,
  liveStatusErrorMessage,
  formatFailureReason,
  type MobileMoneyKind,
} from "../../hooks/useLiveStatus";

const liveStatusClasses: Record<string, string> = {
  COMPLETED: "bg-accent-light text-accent",
  FAILED: "bg-red-50 text-red-600",
  ACCEPTED: "bg-brand-light text-brand",
  ENQUEUED: "bg-brand-light text-brand",
  PROCESSING: "bg-amber-50 text-amber-600",
  IN_RECONCILIATION: "bg-amber-50 text-amber-600",
};

export function LiveStatusCheck({ kind, id }: { kind: MobileMoneyKind; id: string | number }) {
  const { t } = useTranslation();
  const liveStatus = useLiveStatus(kind, id);

  return (
    <div className="mt-4 border-t border-surface-2 pt-4">
      <button
        type="button"
        onClick={() => liveStatus.refetch()}
        disabled={liveStatus.isFetching}
        aria-busy={liveStatus.isFetching || undefined}
        className="inline-flex items-center gap-1.5 rounded-full border border-surface-2 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand/30 disabled:opacity-60"
      >
        {liveStatus.isFetching ? (
          <Loader2 size={13} className="animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw size={13} />
        )}
        {t("dashboard.mobileMoneyForm.checkLiveStatus")}
      </button>

      {liveStatus.isError && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={13} /> {liveStatusErrorMessage(liveStatus.error, t)}
        </p>
      )}

      {liveStatus.data && (
        <div className="mt-3 space-y-1.5 text-left text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted">{t("dashboard.mobileMoneyForm.localStatus")}</span>
            <span className="font-semibold text-ink">{liveStatus.data.local_status}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">{t("dashboard.mobileMoneyForm.liveStatus")}</span>
            <span
              className={`rounded-full px-2 py-0.5 font-semibold ${
                liveStatusClasses[liveStatus.data.live_status] ?? "bg-surface text-muted-2"
              }`}
            >
              {liveStatus.data.live_status}
            </span>
          </div>
          {formatFailureReason(liveStatus.data.failure_reason) && (
            <div className="flex items-center justify-between">
              <span className="text-muted">{t("dashboard.mobileMoneyForm.failureReason")}</span>
              <span className="font-semibold text-red-600">
                {formatFailureReason(liveStatus.data.failure_reason)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
