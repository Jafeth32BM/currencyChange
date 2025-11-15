import { ExchangeResponse } from "./exchangeResponse.interface";

export interface ConversionState {
    date: string;
    currencyCode: string;
    currencySymbol: string;
    rates: ExchangeResponse | null;
}
