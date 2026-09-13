import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Currency } from "../types/dashboard";

// Devises dans lesquelles un wallet peut être ouvert (table de référence côté API).
export function useCurrencies() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Currency[] }>("/currencies");
      return data.data;
    },
    staleTime: 60 * 60 * 1000,
  });
}
