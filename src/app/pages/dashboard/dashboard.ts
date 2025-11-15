import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductForm } from '../product-form/product-form.';
import { ProductList } from '../product-list/product-list';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'app-dashboard',
  imports: [ProductForm, ProductList],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard {
  public exchangeService = inject(ExchangeService);
}
