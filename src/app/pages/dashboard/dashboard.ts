import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductForm } from '../product-form/product-form.';
import { ProductList } from '../product-list/product-list';

@Component({
  selector: 'app-dashboard',
  imports: [ProductForm, ProductList],
  templateUrl: './dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Dashboard { }
