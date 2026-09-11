import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Wallet } from "../types/dashboard";

export function useWallets() {
  return useQuery({
    queryKey: ["dashboard", "wallets"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Wallet[] }>(
        "/business/dashboard/wallet",
      );
      return data.data;
    },
  });
}

export interface CreateWalletResult {
  wallet: Wallet;
  created: boolean; // true si 201 (nouveau), false si 200 (existait déjà)
}

export function useCreateWallet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (currency_code: string) => {
      const res = await api.post<{ data: Wallet; message: string }>(
        "/business/dashboard/wallet",
        { currency_code },
      );
      return { wallet: res.data.data, created: res.status === 201 } satisfies CreateWalletResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "wallets"] });
    },
  });
}
