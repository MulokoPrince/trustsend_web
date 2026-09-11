import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import { clearSession } from "../lib/session";

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      await api.post("/business/auth/logout");
    },
    onSettled: () => {
      clearSession();
    },
  });
}
