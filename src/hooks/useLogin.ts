import { useMutation } from "@tanstack/react-query";
import type { TFunction } from "i18next";
import { api, ApiError } from "../lib/api";
import { storeSession } from "../lib/session";
import type { LoginResult } from "../types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export function loginErrorMessage(error: unknown, t: TFunction): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return t("login.errorInvalidCredentials");
      case 403:
        return t("login.errorPending");
      case 429:
        return t("login.errorLocked");
      default:
        return error.message;
    }
  }
  return t("login.errorGeneric");
}

export function useLogin() {
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<{ data: LoginResult }>(
        "/business/auth/login",
        payload,
      );
      return data.data;
    },
    onSuccess: (result) => {
      storeSession(result);
    },
  });
}
