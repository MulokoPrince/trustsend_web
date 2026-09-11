import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Paginated, Transaction } from "../types/dashboard";

export function useTransactions(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["dashboard", "transactions", page, limit],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Transaction>>(
        "/business/dashboard/transactions",
        { params: { page, limit } },
      );
      return data;
    },
    placeholderData: (prev) => prev,
  });
}
