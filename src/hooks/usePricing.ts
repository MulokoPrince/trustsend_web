import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Plan } from "../types/dashboard";

/**
 * Catalogue public des offres (GET /pricing), sans connexion : les prix affichés sur la page
 * Tarifs sont ceux configurés dans l'admin, pas des valeurs écrites en dur.
 */
export function usePricing() {
  return useQuery({
    queryKey: ["public", "pricing"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Plan[] }>("/pricing");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
