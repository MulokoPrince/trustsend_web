import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProfile } from "../hooks/useProfile";

/**
 * The access token lives in an httpOnly cookie (auth_cookie_service.ts on the backend) — this
 * app can no longer read it to check "am I logged in" synchronously the way a localStorage token
 * allowed. Instead it asks the server: a successful profile fetch means the cookie is valid, a
 * 401 means it's missing/expired, either way through the same request every dashboard page needs
 * anyway (react-query caches it, so this isn't an extra round-trip in practice).
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const profile = useProfile();

  if (profile.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 size={24} className="animate-spin text-muted-2" />
      </div>
    );
  }

  if (profile.isError) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
