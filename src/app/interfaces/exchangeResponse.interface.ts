export interface ExchangeResponse {
  disclaimer?: string;
  license?: string;
  timestamp?: number;
  base?: string;
  rates: { [key: string]: number };
}

export interface ExchangeRate {
  timestamp: number;
  base: string;
  rates: { [key: string]: number };
}

export interface RateEntry {
  code: string;
  rate: number;
}
