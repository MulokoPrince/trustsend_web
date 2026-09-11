import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Notification } from "../../types/dashboard";
import { formatRelativeTime } from "../../lib/format";

function visualForType(type: string): { icon: LucideIcon; className: string } {
  if (type.startsWith("mobile_money_deposit")) {
    return { icon: ArrowDownToLine, className: "bg-accent-light text-accent" };
  }
  if (type.startsWith("mobile_money_payout")) {
    return { icon: ArrowUpFromLine, className: "bg-surface text-muted-2" };
  }
  if (type.startsWith("business")) {
    return { icon: ShieldCheck, className: "bg-brand-light text-brand" };
  }
  return { icon: Bell, className: "bg-surface text-muted-2" };
}

export function NotificationItem({
  notification,
  compact = false,
  onClick,
}: {
  notification: Notification;
  compact?: boolean;
  onClick?: (notification: Notification) => void;
}) {
  const { icon: Icon, className } = visualForType(notification.type);

  return (
    <button
      type="button"
      onClick={() => onClick?.(notification)}
      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface ${compact ? "" : "sm:px-5"}`}
    >
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${className}`}>
        <Icon size={15} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <span className="truncate">{notification.title}</span>
          {!notification.read && (
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          )}
        </p>
        <p className={`mt-0.5 text-xs text-muted ${compact ? "line-clamp-2" : ""}`}>
          {notification.message}
        </p>
        <p className="mt-1 text-[11px] text-muted-2">
          {formatRelativeTime(notification.created_at)}
        </p>
      </div>
    </button>
  );
}
