import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { ExchangeRate, ExchangeResponse, RateEntry } from '../interfaces/exchangeResponse.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';

const RATES_KEY = 'exchangeRates';


@Injectable({ providedIn: 'root' })
export class ExchangeService {
  envs = environment;
  private http = inject(HttpClient);
  exchangeValue = signal<ExchangeResponse[]>([]);
  allRates = signal<RateEntry[]>([]);

  constructor() {
    console.log('Servicio Creado')
  }

  loadExchangeRates(date: string) {
    this.http.get<ExchangeResponse>(`${this.envs.BASE_URL}/historical/${date}.json`, {
      params: {
        app_id: this.envs.APP_ID,
        base: 'USD'
      }
    })
    .pipe(
      map(resp => {
        const ratesObject = resp.rates;
        const ratesArray = Object.entries(ratesObject);
        const ratesMapped = ratesArray.map(([code, rate]) => ({
          code: code,
          rate: rate
        }));
        return ratesMapped
      }),
      tap(rates => {
        this.allRates.set(rates);
      })
    )

  }

}
