import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Webhook, WebhookDelivery, WebhookEvent } from "../types/dashboard";

export function useWebhooks() {
  return useQuery({
    queryKey: ["dashboard", "webhooks"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Webhook[] }>(
        "/business/dashboard/webhooks",
      );
      return data.data;
    },
  });
}

export interface CreateWebhookPayload {
  url: string;
  events: WebhookEvent[];
}

export function useCreateWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateWebhookPayload) => {
      const { data } = await api.post<{
        data: Webhook & { secret: string; message: string };
      }>("/business/dashboard/webhooks", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "webhooks"] });
    },
  });
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/business/dashboard/webhooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "webhooks"] });
    },
  });
}

export function useWebhookDeliveries(id: number | null) {
  return useQuery({
    queryKey: ["dashboard", "webhooks", id, "deliveries"],
    queryFn: async () => {
      const { data } = await api.get<{ data: WebhookDelivery[] }>(
        `/business/dashboard/webhooks/${id}/deliveries`,
      );
      return data.data;
    },
    enabled: id !== null,
  });
}
