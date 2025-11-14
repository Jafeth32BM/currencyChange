import { ExchangeResponse } from "./exchangeResponse.interface";

export interface ConversionState {
    date: string;
    currencyCode: string;
    currencySymbol: string;
    // Guardamos la respuesta completa para usarla en el cálculo
    rates: ExchangeResponse | null;
}
