// product-list.ts
import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit, effect } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExchangeService } from '../../services/exchange.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'product-list',
  imports: [CurrencyPipe],
  templateUrl: './product-list.html'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
  public exchangeService = inject(ExchangeService);

  today = new Date().toISOString().split('T')[0];
  date = signal(this.today);
  selectCurrency = signal<string>('MXN');
  minDate = this.calculateMinDate();
  maxDate = this.today;

  productos = this.productService.productos;

  totalMXN = computed(() => {
    return this.productos().reduce((acc, product) => acc + product.price_mxn, 0);
  });

  totalConverted = computed(() => {
    return this.exchangeService.convertFromMXN(this.totalMXN());
  });

  productosConvertidos = computed(() => {
    return this.productos().map(product => ({
      ...product,
      price_converted: this.exchangeService.convertFromMXN(product.price_mxn)
    }));
  });

  constructor() {
    // Usamos effect para reaccionar a cambios en las señales
    effect(() => {
      const currentDate = this.date();
      const currentCurrency = this.selectCurrency();

      this.exchangeService.updateDate(currentDate);
      this.exchangeService.updateCurrency(currentCurrency);
    });
  }

  ngOnInit() {
    // Inicializar con valores actuales
    this.exchangeService.updateDate(this.date());
    this.exchangeService.updateCurrency(this.selectCurrency());
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.date.set(input.value);
  }

  onCurrencyChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectCurrency.set(select.value);
  }

  private calculateMinDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 15);
    return date.toISOString().split('T')[0];
  }

  formatCurrency(value: number): string {
    return value.toFixed(2);
  }
}
