import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { Producto } from '../../interfaces/product.interface';

@Component({
  selector: 'product-form',
  imports: [],
  templateUrl: './product-form.html'
})
export class ProductForm {
  producto = signal('');
  precio = signal(0);

  newProduct = output<Producto>();
  productos = input.required<Producto[]>()

  addProduct() {
    if (!this.precio() || !this.precio() || this.precio() <= 0) { return }
    const newProduct: Producto ={
      id: crypto.randomUUID(),
      name: this.producto(),
      price_mxn: this.precio(),
      date_added: Date.now() }

    this.newProduct.emit(newProduct);
    console.log('Producto agregado:', newProduct)
    this.producto.set('');
    this.precio.set(0);
  }
}
