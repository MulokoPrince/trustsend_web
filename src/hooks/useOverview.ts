import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Overview } from "../types/dashboard";

export function useOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Overview }>(
        "/business/dashboard/overview",
      );
      return data.data;
    },
  });
}
