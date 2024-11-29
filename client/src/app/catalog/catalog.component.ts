import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products/product.service';
import { AuthUser, Product } from '../types';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { environment } from '../../environment';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ ProductCardComponent ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  selectedCategories: String[] = [];
  filteredProducts: Product[] = [];

  user: AuthUser | null = null;

  constructor(private productService: ProductService, private userService: UserService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data]; 
      },
      error: (error) => {
        console.error(`Error fetching products: ${error}`);
      }
    });

    this.user = this.userService.getUser
  }

  categories = environment.categories;

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (target.checked) {
      this.selectedCategories.push(target.id);
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (category) => category !== target.id
      );
    }

    if (this.selectedCategories.length !== 0) {
      this.filteredProducts = this.products.filter((product) =>
        this.selectedCategories.includes(product.category)
      );
    } else {
      this.filteredProducts = [...this.products];
    }
  }
}
