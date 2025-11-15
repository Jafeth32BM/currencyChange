// product.service.ts
import { Injectable, signal } from '@angular/core';
import { Producto } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _productos = signal<Producto[]>([
    { id: crypto.randomUUID(), name: 'camisa', price_mxn: 150, date_added: Date.now() },
    { id: crypto.randomUUID(), name: 'pantalon', price_mxn: 250, date_added: Date.now() },
    { id: crypto.randomUUID(), name: 'Short', price_mxn: 120, date_added: Date.now() },
    { id: crypto.randomUUID(), name: 'tenis', price_mxn: 350, date_added: Date.now() },
    { id: crypto.randomUUID(), name: 'Corbata', price_mxn: 99, date_added: Date.now() },
    { id: crypto.randomUUID(), name: 'Lentes', price_mxn: 150, date_added: Date.now() },
  ]);

  productos = this._productos.asReadonly();

  addProduct(name: string, price_mxn: number) {
    const newProduct: Producto = {
      id: crypto.randomUUID(),
      name,
      price_mxn,
      date_added: Date.now()
    };

    this._productos.update(products => [...products, newProduct]);
  }
}
