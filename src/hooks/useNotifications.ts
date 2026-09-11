import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { NotificationsResponse } from "../types/dashboard";

export function useNotifications(page = 1, limit = 20) {
  return useQuery({
    queryKey: ["dashboard", "notifications", page, limit],
    queryFn: async () => {
      const { data } = await api.get<NotificationsResponse>(
        "/business/dashboard/notifications",
        { params: { page, limit } },
      );
      return data;
    },
    placeholderData: (prev) => prev,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/business/dashboard/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notifications"] });
    },
  });
}
