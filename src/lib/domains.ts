/**
 * Séparation des domaines : le site vitrine vit sur www.trustsend.africa, l'espace client
 * (connexion, inscription, dashboard) sur business.trustsend.africa. Les deux sont servis par
 * le même build Vercel — ce module décide quelles routes monter selon l'hôte courant et
 * fabrique les liens croisés entre les deux domaines.
 *
 * Les redirections « dures » se font en amont dans vercel.json (règles conditionnées par hôte) ;
 * ce fichier est la seconde barrière, côté client, et la source de vérité pour les liens.
 */

export const BUSINESS_HOST = "business.trustsend.africa";
export const MARKETING_HOST = "www.trustsend.africa";

export const BUSINESS_ORIGIN = `https://${BUSINESS_HOST}`;
export const MARKETING_ORIGIN = `https://${MARKETING_HOST}`;

const hostname = typeof window === "undefined" ? "" : window.location.hostname;

/** En développement (localhost, IP locale, preview Vercel) tout reste accessible sur un seul hôte. */
export const isLocalHost =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.endsWith(".local") ||
  hostname.endsWith(".vercel.app");

export const isBusinessHost = hostname === BUSINESS_HOST || hostname.startsWith("business.");

/** Routes connexion / inscription / dashboard. */
export const showBusinessRoutes = isLocalHost || isBusinessHost;

/** Pages publiques du site vitrine. */
export const showMarketingRoutes = isLocalHost || !isBusinessHost;

/** Lien vers l'espace client : relatif quand on y est déjà, absolu depuis le site vitrine. */
export function businessUrl(path: string) {
  return showBusinessRoutes ? path : `${BUSINESS_ORIGIN}${path}`;
}

/** Lien vers le site vitrine : relatif quand on y est déjà, absolu depuis l'espace client. */
export function marketingUrl(path: string) {
  return showMarketingRoutes ? path : `${MARKETING_ORIGIN}${path}`;
}
