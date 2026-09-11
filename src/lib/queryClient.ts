import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./api";

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Ne jamais retry sur une erreur client (4xx) : requête invalide, non
  // autorisée, ou ressource introuvable — un retry ne changera rien.
  if (error instanceof ApiError && error.status && error.status < 500) {
    return false;
  }
  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
