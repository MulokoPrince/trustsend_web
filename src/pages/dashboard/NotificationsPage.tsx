import { useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMarkNotificationRead, useNotifications } from "../../hooks/useNotifications";
import { NotificationItem } from "../../components/dashboard/NotificationItem";
import type { Notification } from "../../types/dashboard";
import "../../styles/geist.css";

const LIMIT = 20;

export function NotificationsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const notifications = useNotifications(page, LIMIT);
  const markRead = useMarkNotificationRead();
  const totalPages = notifications.data
    ? Math.max(1, Math.ceil(notifications.data.meta.total / LIMIT))
    : 1;

  const onItemClick = (notification: Notification) => {
    if (!notification.read) markRead.mutate(notification.id);
  };

  return (
    <div className="font-geist max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-ink">
        {t("dashboard.notifications.title")}
      </h1>
      <p className="mt-1 text-muted">{t("dashboard.notifications.subtitle")}</p>

      <div className="mt-6 rounded-xl border border-black/10 bg-white">
        {notifications.isLoading ? (
          <p className="flex items-center gap-2 px-5 py-8 text-sm text-muted">
            <Loader2 size={16} className="animate-spin" /> {t("dashboard.loading")}
          </p>
        ) : notifications.isError ? (
          <p className="flex items-center gap-1.5 px-5 py-8 text-sm text-red-600">
            <AlertCircle size={15} /> {t("dashboard.notifications.error")}
          </p>
        ) : notifications.data && notifications.data.data.length > 0 ? (
          <div className="divide-y divide-black/[0.06]">
            {notifications.data.data.map((n) => (
              <NotificationItem key={n.id} notification={n} onClick={onItemClick} />
            ))}
          </div>
        ) : (
          <p className="px-5 py-8 text-sm text-muted">{t("dashboard.notifications.none")}</p>
        )}

        {notifications.data && notifications.data.meta.total > LIMIT && (
          <div className="flex items-center justify-between border-t border-black/[0.06] px-5 py-3.5">
            <p className="text-xs text-muted">
              {t("dashboard.transactions.pageOf", {
                page: notifications.data.meta.page,
                total: totalPages,
              })}{" "}
              ·{" "}
              {t("dashboard.transactions.outOfTotal", {
                count: notifications.data.meta.total,
              })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-muted-2 transition-colors hover:text-ink disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-muted-2 transition-colors hover:text-ink disabled:opacity-40"
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
