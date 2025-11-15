// exchange.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ExchangeResponse } from '../interfaces/exchangeResponse.interface';
import { ConversionState } from '../interfaces/convert.interface';
import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private http = inject(HttpClient);
  private apiKey = environment.APP_ID;
  private baseUrl = environment.BASE_URL;

  // Estado de conversión
  public conversionState = signal<ConversionState>({
    date: new Date().toISOString().split('T')[0],
    currencyCode: 'MXN',
    currencySymbol: '$',
    rates: null
  });

  // Señal para las monedas disponibles
  public availableCurrencies = signal<{code: string, name: string}[]>([]);

  // Señal para indicar si las monedas están cargadas
  public currenciesLoaded = signal<boolean>(false);

  // Datos de nombres de monedas en español
  private currencyNames: {[key: string]: string} = {};

  constructor() {
    this.loadCurrencyNames();
  }

  /**
   * Carga los nombres de monedas en español desde el archivo local
   */
  private loadCurrencyNames(): void {
    this.http.get<{[key: string]: string}>('./assets/currencies.json').pipe(
      tap(names => {
        console.log('Currencies loaded:', Object.keys(names).length);
        this.currencyNames = names;
        this.initializeAvailableCurrencies();
        this.currenciesLoaded.set(true);

        // Cargar tasas después de tener las monedas
        this.loadExchangeRates(this.conversionState().date).subscribe();
      }),
      catchError(error => {
        console.error('Error loading currency names:', error);
        // En caso de error, usar monedas básicas
        this.currencyNames = this.getDefaultCurrencies();
        this.initializeAvailableCurrencies();
        this.currenciesLoaded.set(true);
        this.loadExchangeRates(this.conversionState().date).subscribe();
        return of(undefined);
      })
    ).subscribe();
  }

  /**
   * Inicializa la lista de monedas disponibles
   */
  private initializeAvailableCurrencies(): void {
    const currenciesList = Object.keys(this.currencyNames)
      .map(code => ({
        code,
        name: this.currencyNames[code]
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    console.log('Available currencies:', currenciesList.length);
    this.availableCurrencies.set(currenciesList);
  }

  /**
   * Monedas por defecto en caso de error
   */
  private getDefaultCurrencies(): {[key: string]: string} {
    return {
      'MXN': 'Peso Mexicano',
      'USD': 'Dólar Estadounidense',
      'EUR': 'Euro',
      'BRL': 'Real Brasileño',
      'JPY': 'Yen Japonés',
      'GBP': 'Libra Esterlina',
      'CAD': 'Dólar Canadiense',
      'AUD': 'Dólar Australiano',
      'CHF': 'Franco Suizo',
      'CNY': 'Yuan Chino'
    };
  }

  /**
   * Carga las tasas de cambio para una fecha específica
   */
  loadExchangeRates(date: string): Observable<ExchangeResponse> {
    const url = `${this.baseUrl}/historical/${date}.json?app_id=${this.apiKey}&base=USD`;

    console.log('Loading exchange rates for date:', date);
    return this.http.get<ExchangeResponse>(url).pipe(
      tap(response => {
        console.log('Exchange rates loaded:', Object.keys(response.rates || {}).length);
        this.conversionState.update(state => ({ ...state, rates: response }));
      }),
      catchError(error => {
        console.error('Error loading exchange rates:', error);
        return of({ rates: {} } as ExchangeResponse);
      })
    );
  }

  updateDate(newDate: string): void {
    this.conversionState.update(state => ({ ...state, date: newDate }));
    this.loadExchangeRates(newDate).subscribe();
  }

  updateCurrency(currencyCode: string): void {
    this.conversionState.update(state => ({
      ...state,
      currencyCode
    }));
  }

  convertFromMXN(amountInMXN: number): number {
    const state = this.conversionState();
    const rates = state.rates?.rates;

    if (!rates) {
      return amountInMXN;
    }

    if (state.currencyCode === 'MXN') {
      return amountInMXN;
    }

    if (state.currencyCode === 'USD') {
      const mxnToUsd = rates['MXN'];
      if (mxnToUsd) {
        return amountInMXN / mxnToUsd;
      }
      return amountInMXN;
    }

    const mxnToUsd = rates['MXN'];
    const targetRate = rates[state.currencyCode];

    if (!mxnToUsd || !targetRate) {
      return amountInMXN;
    }

    const amountInUSD = amountInMXN / mxnToUsd;
    return amountInUSD * targetRate;
  }

  areRatesLoaded(): boolean {
    return this.conversionState().rates !== null;
  }
}
