export interface Producto {
  id: string;
  name: string;
  price_mxn: number; // El precio base
  date_added: number; // Fecha creado
}

export interface CurrencyOption {
    country: string;
    code: string;
    symbol: string;
}
