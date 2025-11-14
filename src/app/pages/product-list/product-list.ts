import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ExchangeService } from '../../services/exchange.service';

@Component({
  selector: 'product-list',
  imports: [],
  templateUrl: './product-list.html'
})
export class ProductList {
  // changeService = inject(ExchangeService);

}
