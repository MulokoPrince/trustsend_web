import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface RequestSignupOtpPayload {
  email: string;
}

export function useRequestSignupOtp() {
  return useMutation({
    mutationFn: async (payload: RequestSignupOtpPayload) => {
      const { data } = await api.post<{ message: string }>(
        "/business/auth/signup/request-otp",
        payload,
      );
      return data;
    },
  });
}

export interface SignupPayload {
  name: string;
  email: string;
  otp: string;
  phone: string;
  password: string;
  code?: string;
}

export interface SignupResult {
  id: number;
  code: string;
  name: string;
  email: string;
  status: string;
  message: string;
}

export function useSignup() {
  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      const { data } = await api.post<{ data: SignupResult }>(
        "/business/auth/signup",
        payload,
      );
      return data.data;
    },
  });
}
