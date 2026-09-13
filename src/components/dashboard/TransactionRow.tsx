import { ArrowDownToLine, ArrowUpFromLine, Repeat } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Transaction } from "../../types/dashboard";
import { formatDateTime, formatMinorUnits } from "../../lib/format";

const statusKeys: Record<string, string> = {
  completed: "statusCompleted",
  failed: "statusFailed",
  pending: "statusPending",
  initiated: "statusInitiated",
};

const statusClasses: Record<string, string> = {
  completed: "bg-accent-light text-accent",
  failed: "bg-red-50 text-red-600",
  pending: "bg-amber-50 text-amber-600",
  initiated: "bg-brand-light text-brand",
};

function readMetaAmount(metadata: Record<string, unknown>): string | null {
  const amount = metadata["amount"];
  const currency = metadata["currency_code"];
  if (
    (typeof amount === "string" || typeof amount === "number") &&
    typeof currency === "string"
  ) {
    return formatMinorUnits(String(amount), currency);
  }
  return null;
}

export function TransactionRow({ tx }: { tx: Transaction }) {
  const { t } = useTranslation();
  const isDeposit = tx.type === "mobile_money_deposit";
  const isSwap = tx.type === "fx_swap";
  const amount = readMetaAmount(tx.metadata);

  return (
    <li className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          isDeposit ? "bg-accent-light text-accent" : "bg-surface text-muted-2"
        }`}
      >
        {isSwap ? <Repeat size={16} /> : isDeposit ? <ArrowDownToLine size={16} /> : <ArrowUpFromLine size={16} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">
          {isSwap
            ? t("dashboard.transactionRow.swapLabel")
            : isDeposit
              ? t("dashboard.transactionRow.depositLabel")
              : t("dashboard.transactionRow.withdrawLabel")}
        </p>
        <p className="truncate text-xs text-muted">
          {isSwap
            ? `${String(tx.metadata["from_currency"] ?? "")} → ${String(tx.metadata["to_currency"] ?? "")}`
            : tx.provider}{" "}
          · #{tx.transaction_id}
        </p>
      </div>
      <div className="shrink-0 text-end">
        {amount && (
          <p className={`text-sm font-semibold ${isDeposit ? "text-accent" : "text-ink"}`}>
            {isDeposit ? "+" : "-"}
            {amount}
          </p>
        )}
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusClasses[tx.status] ?? "bg-surface text-muted-2"}`}
        >
          {statusKeys[tx.status]
            ? t(`dashboard.transactionRow.${statusKeys[tx.status]}`)
            : tx.status}
        </span>
        <p className="mt-1 text-xs text-muted">{formatDateTime(tx.created_at)}</p>
      </div>
    </li>
  );
}
