import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../types';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})

export class DetailsComponent implements OnInit {
  productId: string = '';
  product: Product | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,

  ) {}

  ngOnInit(): void {
    
    this.route.params.subscribe({
      next: (params) => {
        this.productId = params['id'];

        if (this.productId) {
          this.fetchProduct();
        }

      },
      error: (err) => console.error(`Error getting product id: ${err}`)
    });
  }

  private fetchProduct(): void {
    this.productService.getProductById(this.productId).subscribe({
      next: (data) => this.product = data,
      error: (err) => console.error(`Error fetching product by id: ${err}`)
    });
  }

  startChat(productId: string | undefined, ownerId: string | undefined): void {
    // chat initialization logic.
  }
  
  deleteProduct(productId: string | undefined): void {
    this.productService.deleteProductById(productId).subscribe({
      next: () =>  this.router.navigate(['/catalog']),
      error: (err) => console.error(`Error deleting product by id: ${err}`)
    });
  }

}
