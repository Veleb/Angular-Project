import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products/product.service';
import { AuthUser, Product } from '../types';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { environment } from '../../environments/environment';
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
  selectedCategories: string[] = [];
  filteredProducts: Product[] = [];

  user: AuthUser | null = null;
  showSavedOnly: boolean = false;

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

    this.userService.getProfile().subscribe({
      next: (currentUser: AuthUser | null) => {
        this.user = currentUser;
      },
      error: (err) => console.error('Error fetching user profile:', err),
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
        this.filteredProducts = this.products.filter((product) =>
          this.selectedCategories.includes(product.category)
        );
      } else {
        this.filteredProducts = [...this.products];
      }
    }
  }

  showSavedProducts(): void {
    this.productService.getUserSavedProducts().subscribe({
      next: (data: Product[]) => {
        if (data.length > 0) {
          this.filteredProducts = data;
        } else {
          this.filteredProducts = [];
        }
      },
      error: (err) => {
        console.error('Error fetching saved products:', err);
      },
    });
  }
}
