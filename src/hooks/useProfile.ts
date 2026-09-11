import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Profile } from "../types/dashboard";

export function useProfile() {
  return useQuery({
    queryKey: ["dashboard", "profile"],
    queryFn: async () => {
      const { data } = await api.get<{ data: Profile }>(
        "/business/dashboard/profile",
      );
      return data.data;
    },
  });
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  webhook_url?: string;
}

export interface UpdateProfileResult {
  id: number;
  name: string;
  phone: string;
  webhook_url: string | null;
  updated_at: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const { data } = await api.patch<{ data: UpdateProfileResult }>(
        "/business/dashboard/profile",
        payload,
      );
      return data.data;
    },
    onSuccess: () => {
      // La réponse PATCH est partielle (pas email/code/status) : on
      // refetch le profil complet plutôt que d'écraser le cache.
      queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
    },
  });
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordPayload) => {
      await api.post("/business/auth/change-password", payload);
    },
  });
}

export function useSetPin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pin: string) => {
      await api.post("/business/dashboard/pin", { pin });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "profile"] });
    },
  });
}

export interface ChangePinPayload {
  current_pin: string;
  new_pin: string;
}

export function useChangePin() {
  return useMutation({
    mutationFn: async (payload: ChangePinPayload) => {
      await api.post("/business/dashboard/pin/change", payload);
    },
  });
}
