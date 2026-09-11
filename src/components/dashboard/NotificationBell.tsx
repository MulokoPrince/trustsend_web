import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMarkNotificationRead, useNotifications } from "../../hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";
import type { Notification } from "../../types/dashboard";

export function NotificationBell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notifications = useNotifications(1, 5);
  const markRead = useMarkNotificationRead();
  const unreadCount = notifications.data?.meta.unread_count ?? 0;

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  };

  const onItemClick = (notification: Notification) => {
    if (!notification.read) markRead.mutate(notification.id);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("dashboard.notifications.title")}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-muted-2 transition-colors hover:bg-surface hover:text-ink sm:flex"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-xl border border-black/10 bg-white shadow-pop"
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] px-4 py-3">
              <p className="text-sm font-semibold text-ink">{t("dashboard.notifications.title")}</p>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-light px-2 py-0.5 text-[11px] font-semibold text-brand">
                  {t("dashboard.notifications.unreadCount", { count: unreadCount })}
                </span>
              )}
            </div>

            {notifications.isLoading ? (
              <p className="flex items-center gap-2 px-4 py-6 text-sm text-muted">
                <Loader2 size={14} className="animate-spin" /> {t("dashboard.loading")}
              </p>
            ) : notifications.data && notifications.data.data.length > 0 ? (
              <div className="max-h-80 divide-y divide-black/[0.06] overflow-y-auto">
                {notifications.data.data.map((n) => (
                  <NotificationItem key={n.id} notification={n} compact onClick={onItemClick} />
                ))}
              </div>
            ) : (
              <p className="px-4 py-6 text-sm text-muted">{t("dashboard.notifications.none")}</p>
            )}

            <Link
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="block border-t border-black/[0.06] px-4 py-2.5 text-center text-sm font-medium text-brand hover:bg-surface"
            >
              {t("dashboard.notifications.viewAll")}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
