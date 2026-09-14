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
export const SANDBOX_HOST = "sandbox.trustsend.africa";

export const BUSINESS_ORIGIN = `https://${BUSINESS_HOST}`;
export const MARKETING_ORIGIN = `https://${MARKETING_HOST}`;

/** API de la sandbox : comptes, clés et argent de test, totalement séparés de la production. */
export const SANDBOX_API_BASE_URL = "https://sandbox-api.trustsend.africa/api/v1";

const hostname = typeof window === "undefined" ? "" : window.location.hostname;

/** En développement (localhost, IP locale, preview Vercel) tout reste accessible sur un seul hôte. */
export const isLocalHost =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname.endsWith(".local") ||
  hostname.endsWith(".vercel.app");

/** Espace client de la sandbox : même build, reconnu à son hôte. */
export const isSandboxHost = hostname === SANDBOX_HOST || hostname.startsWith("sandbox.");

/**
 * Mode sandbox de l'interface. En local, VITE_APP_MODE=sandbox permet de tester l'affichage
 * sandbox contre une API locale (VITE_API_BASE_URL) sans passer par le vrai domaine.
 */
export const isSandbox = isSandboxHost || import.meta.env.VITE_APP_MODE === "sandbox";

export const isBusinessHost =
  hostname === BUSINESS_HOST || hostname.startsWith("business.") || isSandboxHost;

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
