import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../products/product.service';
import { Product } from '../types';
import { ProductCardComponent } from '../products/product-card/product-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ RouterLink, ProductCardComponent ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(private productService: ProductService) {}

  products: Product[] | null = null;

  ngOnInit(): void {
    this.productService.getProducts(3).subscribe({
      next: (data) => {
        console.log(data);
        
        this.products = data;
      }
    });
  }

}
