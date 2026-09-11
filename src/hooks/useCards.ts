import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api, ApiError } from "../lib/api";
import type { Card, CardTransaction } from "../types/dashboard";

const CARDS_KEY = ["dashboard", "cards"];

export function useCards() {
  return useQuery({
    queryKey: CARDS_KEY,
    queryFn: async () => {
      const { data } = await api.get<{ data: Card[] }>("/business/dashboard/cards");
      return data.data;
    },
  });
}

export function useCard(id: number | undefined) {
  return useQuery({
    queryKey: [...CARDS_KEY, id],
    enabled: id !== undefined,
    queryFn: async () => {
      const { data } = await api.get<{ data: Card & { details: unknown } }>(
        `/business/dashboard/cards/${id}`,
      );
      return data.data;
    },
  });
}

// 90 derniers jours par défaut — l'API exige une plage explicite.
function last90Days() {
  const end = new Date();
  const start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { start_date: iso(start), end_date: iso(end) };
}

export function useCardTransactions(id: number | undefined) {
  return useQuery({
    queryKey: [...CARDS_KEY, id, "transactions"],
    enabled: id !== undefined,
    queryFn: async () => {
      const { data } = await api.get<{ data: CardTransaction[] }>(
        `/business/dashboard/cards/${id}/transactions`,
        { params: last90Days() },
      );
      return data.data;
    },
  });
}

export interface CreateCardPayload {
  wallet_id: number;
  brand: "VISA" | "MASTERCARD";
  amount: string; // smallest unit
  currency_code?: string;
  pin: string;
  idempotency_key: string;
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCardPayload) => {
      const { data } = await api.post<{ data: Card & { details: unknown } }>(
        "/business/dashboard/cards",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARDS_KEY });
    },
  });
}

interface CardAmountPayload {
  id: number;
  amount: string;
  pin: string;
  idempotency_key: string;
}

export function useTopupCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: CardAmountPayload) => {
      const { data } = await api.patch<{ data: { id: number; balance: string; status: string } }>(
        `/business/dashboard/cards/${id}/topup`,
        payload,
      );
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CARDS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CARDS_KEY, id] });
    },
  });
}

export function useWithdrawCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: CardAmountPayload) => {
      const { data } = await api.patch<{ data: { id: number; balance: string; status: string } }>(
        `/business/dashboard/cards/${id}/withdraw`,
        payload,
      );
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CARDS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CARDS_KEY, id] });
    },
  });
}

function useCardActionMutation(action: "freeze" | "unfreeze" | "terminate") {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, idempotency_key }: { id: number; idempotency_key: string }) => {
      const url = `/business/dashboard/cards/${id}/${action}`;
      const { data } =
        action === "terminate"
          ? await api.post<{ data: { id: number; status: string } }>(url, { idempotency_key })
          : await api.patch<{ data: { id: number; status: string } }>(url, { idempotency_key });
      return data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CARDS_KEY });
      queryClient.invalidateQueries({ queryKey: [...CARDS_KEY, id] });
    },
  });
}

export function useFreezeCard() {
  return useCardActionMutation("freeze");
}

export function useUnfreezeCard() {
  return useCardActionMutation("unfreeze");
}

export function useTerminateCard() {
  return useCardActionMutation("terminate");
}

export function cardErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    if (error.fieldErrors?.some((e) => e.field === "pin")) {
      return t("dashboard.mobileMoneyForm.errorPinRequired");
    }
    switch (error.status) {
      case 402:
        return t("dashboard.cards.errorInsufficientBalance");
      case 403:
        return error.message; // message du plan-gate déjà explicite côté serveur
      case 404:
        return t("dashboard.cards.errorNotFound");
      case 409:
        return t("dashboard.mobileMoneyForm.errorIdempotency");
      case 503:
        return t("dashboard.mobileMoneyForm.errorUnavailable");
      default:
        return error.message;
    }
  }
  return t("dashboard.cards.errorGeneric");
}
