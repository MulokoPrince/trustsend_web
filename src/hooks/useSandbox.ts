import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface SandboxFundResult {
  transaction_id: string;
  wallet_id: number;
  currency_code: string;
  amount: string;
  balance: string;
}

/**
 * Crédite de l'argent fictif sur un portefeuille (POST /business/dashboard/sandbox/fund).
 * N'existe que sur l'API sandbox : en production, l'endpoint répond 404.
 */
export function useSandboxFund() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { currency_code: string; amount: string }) => {
      const { data } = await api.post<{ data: SandboxFundResult }>(
        "/business/dashboard/sandbox/fund",
        // Une clé par clic : un double envoi réseau ne crédite pas deux fois.
        { ...input, idempotency_key: crypto.randomUUID() },
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "wallets"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] });
    },
  });
}
