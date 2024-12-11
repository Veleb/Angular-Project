import { Component, OnInit } from '@angular/core';
import { ProductService } from '../products/product.service';
import { AuthUser, Product } from '../types';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { environment } from '../../environments/environment';
import { UserService } from '../user/user.service';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private productService: ProductService, private userService: UserService, private toastr: ToastrService) {}

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
      this.productService.getUserSavedProducts().subscribe({
        next: (savedProducts: Product[]) => {
          this.filteredProducts = this.selectedCategories.length > 0
            ? savedProducts.filter((product) =>
                this.selectedCategories.includes(product.category || '')
              )
            : savedProducts;
        },
        error: (err) => console.error('Error fetching saved products:', err),
      });
    } else {
      this.filteredProducts = this.selectedCategories.length > 0
        ? this.products.filter((product) =>
            this.selectedCategories.includes(product.category || '')
          )
        : [...this.products];
    }
  }

  showSavedProducts(): void {
    this.productService.getUserSavedProducts().subscribe({
      next: (data: Product[]) => {
        this.filteredProducts = data.length > 0 ? data : [];
        if (data.length === 0) {
          this.toastr.info('No saved products found!', 'Info');
        }
      },
      error: (err) => {
        console.error('Error fetching saved products:', err);
        this.toastr.error('Failed to load saved products.', 'Error');
      },
    });
  }

}