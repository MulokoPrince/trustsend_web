// Les montants de l'API sont en plus petite unité (ex. centimes), sous forme
// de string (bigint côté serveur). On suppose 2 décimales par défaut.
export function formatMinorUnits(amount: string, currencyCode: string): string {
  const value = Number(amount) / 100;
  return `${value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
