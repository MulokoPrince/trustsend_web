import { useEffect } from "react";

/** Renvoie vers l'autre domaine (vitrine <-> espace client) sans laisser d'entrée d'historique. */
export function ExternalRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}
