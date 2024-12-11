import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products/product.service';
import { AuthUser, Product } from '../types';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { environment } from '../../environments/environment';
import { UserService } from '../user/user.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ ProductCardComponent ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  selectedCategories: string[] = [];
  filteredProducts: Product[] = [];

  user: AuthUser | null = null;
  showSavedOnly: boolean = false;

  constructor(private productService: ProductService, private userService: UserService) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts(0),
      user: this.userService.getProfile()
    }).subscribe({
      next: (results) => {
        this.products = results.products;
        this.filteredProducts = [...results.products];
        this.user = results.user;
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
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

    this.applyFilters();
  }

  onToggleSavedProducts(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.showSavedOnly = target.checked;

    this.applyFilters();
  }

  applyFilters(): void {
    if (this.showSavedOnly) {
      this.showSavedProducts();
    } else {
      if (this.selectedCategories.length !== 0) {
        this.filteredProducts = this.products.filter((product: Product) =>
          this.selectedCategories.includes(product.category || '')
        );
      } else {
        this.filteredProducts = [...this.products];
      }
    }
  }

  showSavedProducts(): void {
    this.productService.getUserSavedProducts().subscribe({
      next: (data: Product[]) => {
        this.filteredProducts = [];

        if (data.length > 0) {
          this.filteredProducts = data;
        }
        
      },
      error: (err) => {
        console.error('Error fetching saved products:', err);
      },
    });
  }
}
