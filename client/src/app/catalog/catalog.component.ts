import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../types';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}
  
  selectedCategories: String[] = [];

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error(`Error fetching products: ${error}`)
      }
    })
  }

  categories = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Books',
    'Toys',
    'Sports & Outdoors',
    'Health & Beauty',
    'Automotive',
    'Groceries',
    'Music & Movies'
  ];

  // add logic if selectedCategories iz empty to be all categories

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLInputElement; 
    
    if (target.checked) {
      this.selectedCategories.push(target.id);
    }
    else {
      this.selectedCategories = this.selectedCategories.filter(category => category !== target.id);
    }
  }
}
