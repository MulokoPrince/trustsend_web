import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api, ApiError } from "../lib/api";
import type { ActivePlan, Plan, PlanSubscription } from "../types/dashboard";

export function usePlans() {
  return useQuery({
    queryKey: ["dashboard", "plans"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Plan[] }>("/business/dashboard/plans");
      return data.data;
    },
  });
}

// GET /business/dashboard/plan répond toujours 200 — `data: null` signifie
// qu'aucun plan n'est assigné (pas de 404).
export function useActivePlan(enabled = true) {
  return useQuery({
    queryKey: ["dashboard", "plan", "active"],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<{ data: ActivePlan | null }>("/business/dashboard/plan");
      return data.data;
    },
  });
}

export interface SubscribePlanPayload {
  plan_id: number;
  pin: string;
}

export function useSubscribePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SubscribePlanPayload) => {
      const { data } = await api.post<{ data: PlanSubscription }>(
        "/business/dashboard/plan/subscribe",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "plan"] });
    },
  });
}

export function planErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    if (error.fieldErrors?.some((e) => e.field === "pin")) {
      return t("dashboard.mobileMoneyForm.errorPinRequired");
    }
    // 422 = PlanWalletMissingException (pas de portefeuille dans la devise du plan) ou
    // InsufficientPlanBalanceException (solde insuffisant) — voir plan_service.ts.
    if (error.status === 422) return t("dashboard.overview.planGate.errorInsufficientBalance");
    return error.message;
  }
  return t("dashboard.overview.planGate.errorGeneric");
}
