import { useQuery } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api, ApiError } from "../lib/api";

export interface LiveStatusResult {
  deposit_id?: string;
  payout_id?: string;
  local_status: string;
  live_status: string;
  provider_transaction_id: string | null;
  // Forme non garantie par la doc (string, ou objet {code, message} côté
  // PawaPay) : ne jamais rendre directement en JSX, passer par
  // formatFailureReason().
  failure_reason: unknown;
}

export function formatFailureReason(reason: unknown): string | null {
  if (!reason) return null;
  if (typeof reason === "string") return reason;
  if (typeof reason === "object") {
    const obj = reason as Record<string, unknown>;
    const message = obj.message ?? obj.failureMessage ?? obj.reason;
    const code = obj.code ?? obj.failureCode;
    if (typeof message === "string") return code ? `${message} (${code})` : message;
    if (typeof code === "string") return code;
  }
  return null;
}

export type MobileMoneyKind = "deposits" | "payouts";

export function useLiveStatus(kind: MobileMoneyKind, id: string | number | undefined) {
  return useQuery({
    queryKey: ["dashboard", "mobile-money", kind, id, "live-status"],
    queryFn: async () => {
      const { data } = await api.get<{ data: LiveStatusResult }>(
        `/business/dashboard/mobile-money/${kind}/${id}/live-status`,
      );
      return data.data;
    },
    enabled: false,
    retry: false,
  });
}

export function liveStatusErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 403:
        return t("dashboard.mobileMoneyForm.errorLiveNotOwned");
      case 404:
        return t("dashboard.mobileMoneyForm.errorLiveNotFound");
      case 503:
        return t("dashboard.mobileMoneyForm.errorLiveUnavailable");
      default:
        return error.message;
    }
  }
  return t("dashboard.mobileMoneyForm.errorLiveGeneric");
}
