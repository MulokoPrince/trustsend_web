// Décimales ISO 4217 d'une devise (0 pour XAF, RWF, BIF…, 2 pour USD ou CDF), plafonnées à 2.
export function currencyDecimals(currencyCode: string): number {
  try {
    const digits = new Intl.NumberFormat("en", { style: "currency", currency: currencyCode })
      .resolvedOptions().maximumFractionDigits;
    return Math.min(digits ?? 2, 2);
  } catch {
    return 2;
  }
}

// Les montants de l'API sont en centièmes de la devise pour TOUTES les devises, sous
// forme de string (bigint côté serveur) : "100" vaut 1 USD comme 1 XAF. Seul
// l'affichage suit les décimales de la devise.
export function formatMinorUnits(amount: string, currencyCode: string): string {
  const decimals = currencyDecimals(currencyCode);
  const value = Number(amount) / 100;
  return `${value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} ${currencyCode}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
];

// Formate un timestamp en durée relative ("il y a 5 min"), en retombant sur
// la date complète au-delà d'une semaine pour rester lisible.
export function formatRelativeTime(iso: string, locale = "fr-FR"): string {
  const diffSeconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const absSeconds = Math.abs(diffSeconds);

  if (absSeconds < 45) return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(0, "second");

  if (absSeconds >= 604800) return formatDateTime(iso);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  for (const [unit, secondsInUnit] of RELATIVE_UNITS) {
    if (absSeconds >= secondsInUnit) {
      return rtf.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }
  return rtf.format(Math.round(diffSeconds / 60), "minute");
}
