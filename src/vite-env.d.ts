/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  /** "sandbox" pour afficher l'interface sandbox en local (voir src/lib/domains.ts). */
  readonly VITE_APP_MODE?: "sandbox" | "production";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
