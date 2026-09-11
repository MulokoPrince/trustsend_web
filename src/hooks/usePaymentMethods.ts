import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { PaymentMethodsData } from "../types/paymentMethods";

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["payment-methods"],
    queryFn: async () => {
      const { data } = await api.get<{ data: PaymentMethodsData }>(
        "/business/dashboard/mobile-money/payment-methods/raw",
      );
      return data.data;
    },
    staleTime: 60 * 60_000,
  });
}
