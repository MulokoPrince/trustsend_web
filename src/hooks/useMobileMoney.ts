import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api, ApiError } from "../lib/api";
import type { MobileMoneyOperationResult } from "../types/dashboard";

export function mobileMoneyErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    if (error.fieldErrors?.some((e) => e.field === "pin")) {
      return t("dashboard.mobileMoneyForm.errorPinRequired");
    }

    switch (error.status) {
      case 402:
        return t("dashboard.mobileMoneyForm.errorInsufficientBalance");
      case 404:
        return t("dashboard.mobileMoneyForm.errorNoWallet");
      case 409:
        return t("dashboard.mobileMoneyForm.errorIdempotency");
      case 422:
        return t("dashboard.mobileMoneyForm.errorInvalid");
      case 503:
        return t("dashboard.mobileMoneyForm.errorUnavailable");
      default:
        return error.message;
    }
  }
  return t("dashboard.mobileMoneyForm.errorGeneric");
}

export interface MobileMoneyPayload {
  amount: string;
  currency_code: string;
  phone_number: string;
  provider: string;
  idempotency_key: string;
  pin: string;
}

export function useCreateDeposit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MobileMoneyPayload) => {
      const { data } = await api.post<{ data: MobileMoneyOperationResult }>(
        "/business/dashboard/mobile-money/deposits",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreatePayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: MobileMoneyPayload) => {
      const { data } = await api.post<{ data: MobileMoneyOperationResult }>(
        "/business/dashboard/mobile-money/payouts",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
