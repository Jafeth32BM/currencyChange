import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Producto } from '../interfaces/product.interface';
import { ExchangeResponse } from '../interfaces/exchangeResponse.interface';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private http = inject(HttpClient);
  private localStorageKey = 'currency_articles';


  private productsSubject = new BehaviorSubject<Producto[]>([]);
  public products$ = this.productsSubject.asObservable();

  private apiUrl = environment.BASE_URL;
  private appId = environment.APP_ID;
  private baseCurrency = 'USD';

  constructor() {
    this.loadProductsFromStorage();
  }

  // ==========================================================
  // LÓGICA DE PERSISTENCIA (localStorage)
  // ==========================================================

  private loadProductsFromStorage(): void {
    const productsJson = localStorage.getItem(this.localStorageKey);
    if (productsJson) {
      this.productsSubject.next(JSON.parse(productsJson));
    }
  }

  private saveProductsToStorage(products: Producto[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(products));
  }

  addProducto(name: string, price_mxn: number): void {
    const newProduct: Producto = {
      id: crypto.randomUUID(),
      name: name,
      price_mxn: price_mxn,
      date_added: Date.now()
    };

    const currentProducts = [...this.productsSubject.value, newProduct];
    this.productsSubject.next(currentProducts);
    this.saveProductsToStorage(currentProducts);
  }

  // Para eliminar productos
  deleteProducto(id: string): void {
    const updatedProducts = this.productsSubject.value.filter(p => p.id !== id);
    this.productsSubject.next(updatedProducts);
    this.saveProductsToStorage(updatedProducts);
  }

  // ==========================================================
  // LÓGICA DE API
  // ==========================================================
  getHistoricalRates(date: string): Observable<ExchangeResponse> {
    const url = `${this.apiUrl}/historical/${date}.json?app_id=${this.appId}`;

    return this.http.get<ExchangeResponse>(url).pipe(
      catchError(error => {
        return throwError(() => new Error(`Error ${error.status}: No se pudo obtener la tasa para ${date}. Revise la fecha y el API ID.`));
      })
    );
  }

  // ==========================================================
  // LÓGICA DE CONVERSIÓN
  // ==========================================================
  convertPrice(priceMXN: number, targetCurrency: string, rates: { [key: string]: number }): number {

    // Verificación obligatoria
    if (!rates['MXN'] || !rates[targetCurrency]) {
      throw new Error(`Faltan tasas (MXN o ${targetCurrency}) en la respuesta de la API.`);
    }

    const rateUSDToMXN = rates['MXN'];

    const priceUSD = priceMXN / rateUSDToMXN;

    if (targetCurrency === this.baseCurrency) {
      return priceUSD;
    } else {
      const rateUSDToTarget = rates[targetCurrency];
      const finalPrice = priceUSD * rateUSDToTarget;
      return finalPrice;
    }
  }
}
