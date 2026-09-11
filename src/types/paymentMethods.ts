export interface OperationTypeConfig {
  minAmount: string;
  maxAmount: string;
  decimalsInAmount: string; // "NONE" | "TWO" | ...
  status: string; // "OPERATIONAL" | ...
}

export interface PaymentMethodCurrency {
  currency: string;
  displayName: string;
  operationTypes: {
    DEPOSIT?: OperationTypeConfig;
    PAYOUT?: OperationTypeConfig;
    REFUND?: OperationTypeConfig;
  };
}

export interface PaymentMethodProvider {
  provider: string;
  displayName: string;
  logo: string;
  currencies: PaymentMethodCurrency[];
}

export interface PaymentMethodCountry {
  country: string;
  displayName: { fr: string; en: string };
  prefix: string;
  flag: string;
  providers: PaymentMethodProvider[];
}

export interface PaymentMethodsData {
  // Peut être null si aucune configuration n'est active pour ce business.
  active_configuration: {
    companyName: string;
    countries: PaymentMethodCountry[];
  } | null;
}

export type MobileMoneyOperation = "DEPOSIT" | "PAYOUT";

export function decimalsCount(decimalsInAmount: string): number {
  switch (decimalsInAmount) {
    case "NONE":
      return 0;
    case "ONE":
      return 1;
    case "TWO":
      return 2;
    case "THREE":
      return 3;
    default:
      return 2;
  }
}
