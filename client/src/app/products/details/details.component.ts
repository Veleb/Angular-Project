import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthUser, Product } from '../../types';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})

export class DetailsComponent implements OnInit {
  product: Product | null = null;
  user: AuthUser | null = null;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    
    this.route.params.subscribe({
      next: (params) => {

        if (params['id']) {
          this.productService.getProductById(params['id']).subscribe({
            next: (data) => this.product = data,
            error: (err) => console.error(`Error fetching product by id: ${err}`)
          });
        }

      },
      error: (err) => console.error(`Error getting product id: ${err}`)
    });

    this.user = this.userService.getUser;
  }

  deleteProduct(productId: string | undefined): void {
    this.productService.deleteProductById(productId).subscribe({
      next: () =>  this.router.navigate(['/catalog']),
      error: (err) => console.error(`Error deleting product by id: ${err}`)
    });
  }
  
  startChat(productId: string | undefined, ownerId: string | undefined): void {
    // chat initialization logic.
  }
}
