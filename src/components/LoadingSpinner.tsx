import { Loader2 } from "lucide-react";

/**
 * Indicateur de chargement d'une page ou d'une section : un spinner centré, sans texte visible.
 * Le libellé reste annoncé aux lecteurs d'écran (role="status"), pour ne perdre aucune information.
 */
export function LoadingSpinner({
  label,
  size = 28,
  className = "",
}: {
  label: string;
  size?: number;
  className?: string;
}) {
  return (
    <div role="status" aria-live="polite" className={`flex w-full items-center justify-center py-10 ${className}`}>
      <Loader2 size={size} className="animate-spin text-brand" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
