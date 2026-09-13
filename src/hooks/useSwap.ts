import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api, ApiError } from "../lib/api";
import type { SwapQuote, SwapResult } from "../types/dashboard";

export function swapErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    if (error.fieldErrors?.some((e) => e.field === "pin")) return t("dashboard.swap.errorPinRequired");
    switch (error.status) {
      case 401:
        return t("dashboard.swap.errorPin");
      case 402:
        return t("dashboard.swap.errorInsufficientBalance");
      case 403:
        return t("dashboard.swap.errorPlan");
      case 404:
        return t("dashboard.swap.errorNoWallet");
      case 409:
        return t("dashboard.swap.errorQuoteUsed");
      case 410:
        return t("dashboard.swap.errorQuoteExpired");
      case 422:
        return t("dashboard.swap.errorInvalid");
      case 503:
        return t("dashboard.swap.errorRateUnavailable");
    }
  }
  return t("dashboard.swap.errorGeneric");
}

export interface SwapQuoteInput {
  from_currency: string;
  to_currency: string;
  amount: string;
}

export function useSwapQuote() {
  return useMutation({
    mutationFn: async (input: SwapQuoteInput) => {
      const { data } = await api.post<{ data: SwapQuote }>("/business/dashboard/swaps/quote", input);
      return data.data;
    },
  });
}

export function useExecuteSwap() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { quote_id: string; idempotency_key: string; pin: string }) => {
      const { data } = await api.post<{ data: SwapResult }>("/business/dashboard/swaps", input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
