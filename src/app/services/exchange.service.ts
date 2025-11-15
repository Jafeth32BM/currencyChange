import { effect, Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Producto } from '../interfaces/product.interface';

@Injectable({ providedIn: 'root' })
export class ExchangeService {
  public productos = signal<Producto[]>([]);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);

    // Solo en el cliente, cargamos desde localStorage
    if (this.isBrowser) {
      const loadedProducts = this.loadFromLocalStorage();
      this.productos.set(loadedProducts);
    }

    // El efecto solo guardará en el cliente
    effect(() => {
      if (this.isBrowser) {
        try {
          localStorage.setItem('productos', JSON.stringify(this.productos()));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }
    });
  }

  private loadFromLocalStorage(): Producto[] {
    try {
      const productos = localStorage.getItem('productos');
      return productos ? JSON.parse(productos) : [];
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return [];
    }
  }

  addNewProduct(newProduct: Producto) {
    this.productos.update((list) => [...list, newProduct]);
  }
}
