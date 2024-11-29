import { Component, Input } from '@angular/core';
import { AuthUser, Product } from '../../types';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() user: AuthUser | null = null;

  favoriteProduct(productId: string): void {
    // check if user has already liked the post and make call to api with the product id and the user id that youll get
  }
}
