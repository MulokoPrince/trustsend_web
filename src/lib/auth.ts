import { api } from "./api";
import { storeSession, clearSession } from "./session";
import type { LoginResult } from "../types/auth";

// Renouvelle le token avant expiration (à appeler ex. depuis un minuteur ou
// avant une requête sensible). Déconnecte si le refresh échoue.
export async function refreshSession(): Promise<LoginResult | null> {
  try {
    const { data } = await api.post<{ data: LoginResult }>(
      "/business/auth/refresh",
    );
    storeSession(data.data);
    return data.data;
  } catch {
    clearSession();
    return null;
  }
}
