export interface Business {
  id: number;
  code: string;
  name: string;
  email: string;
}

export interface LoginResult {
  business: Business;
  expires_in: number;
  /** Jeton CSRF à renvoyer en en-tête X-CSRF-Token sur les requêtes mutantes. */
  csrf_token?: string;
}
