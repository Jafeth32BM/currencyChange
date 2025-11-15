import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';
import { Producto } from '../../interfaces/product.interface';
import { CurrencyPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'product-list',
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './product-list.html'
})
export class ProductList {
  productos = input.required<Producto[]>()

  today = new Date().toISOString().split('T')[0];
  date = signal(this.today);
  selectCurrency = signal<string>('MXN');
  minDate = this.MinDate();
  maxDate = this.today;

  total = computed(() => {
    return this.productos().reduce((acc, product) => acc + product.price_mxn, 0)
  })

  private MinDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 15);
    return date.toISOString().split('T')[0];
  }
}
