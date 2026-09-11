export interface Business {
  id: number;
  code: string;
  name: string;
  email: string;
}

export interface LoginResult {
  business: Business;
  expires_in: number;
}
