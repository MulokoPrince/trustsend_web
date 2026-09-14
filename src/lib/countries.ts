// L'API identifie les pays en ISO 3166-1 alpha-3 (COD, TZA…) ; Intl.DisplayNames n'accepte que
// l'alpha-2. Table limitée aux marchés mobile money couverts, avec repli sur le code brut.
const ALPHA3_TO_ALPHA2: Record<string, string> = {
  BDI: "BI",
  BEN: "BJ",
  BFA: "BF",
  CIV: "CI",
  CMR: "CM",
  COD: "CD",
  COG: "CG",
  ETH: "ET",
  GAB: "GA",
  GHA: "GH",
  KEN: "KE",
  MOZ: "MZ",
  MWI: "MW",
  NGA: "NG",
  RWA: "RW",
  SEN: "SN",
  SLE: "SL",
  TZA: "TZ",
  UGA: "UG",
  ZMB: "ZM",
};

/** Nom du pays dans la langue d'affichage (« RD Congo », « Tanzania »…), ou le code s'il est inconnu. */
export function countryName(alpha3: string, locale: string): string {
  const alpha2 = ALPHA3_TO_ALPHA2[alpha3.toUpperCase()];
  if (!alpha2) return alpha3;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(alpha2) ?? alpha3;
  } catch {
    return alpha3;
  }
}
