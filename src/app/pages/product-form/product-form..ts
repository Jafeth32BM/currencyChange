// product-form.ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'product-form',
  imports: [FormsModule],
  templateUrl: './product-form.html'
})
export class ProductForm {
  private productService = inject(ProductService);

  productName = '';
  productPrice = '';

  addProduct() {
    if (this.productName && this.productPrice) {
      const price = parseInt(this.productPrice, 10);
      if (!isNaN(price) && price > 0) {
        this.productService.addProduct(this.productName, price);

        // Limpiar el formulario
        this.productName = '';
        this.productPrice = '';
      }
    }
  }
}
