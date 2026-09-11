import { useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionRow } from "../../components/dashboard/TransactionRow";

const LIMIT = 20;

export function TransactionsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const txs = useTransactions(page, LIMIT);
  const totalPages = txs.data ? Math.max(1, Math.ceil(txs.data.meta.total / LIMIT)) : 1;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">{t("dashboard.transactions.title")}</h1>
      <p className="mt-1 text-muted">{t("dashboard.transactions.subtitle")}</p>

      <div className="mt-6 rounded-2xl border border-surface-2 bg-white">
        {txs.isLoading ? (
          <p className="flex items-center gap-2 px-5 py-8 text-sm text-muted">
            <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
          </p>
        ) : txs.isError ? (
          <p className="flex items-center gap-1.5 px-5 py-8 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.transactions.error")}
          </p>
        ) : txs.data && txs.data.data.length > 0 ? (
          <ul className="divide-y divide-surface-2">
            {txs.data.data.map((tx) => (
              <TransactionRow key={tx.transaction_id} tx={tx} />
            ))}
          </ul>
        ) : (
          <p className="px-5 py-8 text-sm text-muted">{t("dashboard.transactions.none")}</p>
        )}

        {txs.data && txs.data.meta.total > LIMIT && (
          <div className="flex items-center justify-between border-t border-surface-2 px-5 py-3.5">
            <p className="text-xs text-muted">
              {t("dashboard.transactions.pageOf", { page: txs.data.meta.page, total: totalPages })} ·{" "}
              {t("dashboard.transactions.outOfTotal", { count: txs.data.meta.total })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-2 text-muted-2 transition-colors hover:text-ink disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-surface-2 text-muted-2 transition-colors hover:text-ink disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
