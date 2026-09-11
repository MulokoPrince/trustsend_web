import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { ApiKey } from "../types/dashboard";

export function useApiKeys() {
  return useQuery({
    queryKey: ["dashboard", "api-keys"],
    queryFn: async () => {
      const { data } = await api.get<{ data: ApiKey[] }>(
        "/business/dashboard/api-keys",
      );
      return data.data;
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{
        data: { key_id: number; api_key: string; message: string };
      }>("/business/dashboard/api-keys");
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "api-keys"] });
    },
  });
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/dashboard/api-keys/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "api-keys"] });
    },
  });
}
