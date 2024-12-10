import { Component, Input, OnInit } from '@angular/core';
import { AuthUser, Product } from '../../types';
import { RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
import { ProductService } from '../product.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;

  user: AuthUser | null = null;
  owner: AuthUser | null = null;
  isOwner: boolean | null = null;
  isSaved: boolean | undefined;

  constructor(
    private userService: UserService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const ownerId = this.product._ownerId;

    this.userService.fetchProfile(ownerId).subscribe({
      next: (userData: AuthUser) => (this.owner = userData),
      error: (err) => console.error('Error fetching owner profile:', err),
    });

    this.userService.getProfile().subscribe({

      next: (currentUser: AuthUser | null) => {
        this.user = currentUser;
        this.isOwner = this.product._ownerId === this.user?._id;
        this.isSaved = this.user?.savedProducts.includes(this.product._id);
      },

      error: (err) => console.error('Error fetching user profile:', err),
    });
  }

  favoriteProduct(productId: string): void {
    const hasSaved = this.isSaved;

    const toggleFavorite = hasSaved
      ? this.productService.unsaveProduct(productId).pipe(
          tap(() => {
            this.isSaved = false;
            this.user!.savedProducts = this.user!.savedProducts.filter(
              (id) => id !== productId
            );
          })
        )
      : this.productService.saveProduct(productId).pipe(
          tap(() => {
            this.isSaved = true;
            this.user!.savedProducts = [...this.user!.savedProducts, productId];
          })
        );

    toggleFavorite.subscribe({
      error: (err) => console.error(`Error ${hasSaved ? 'unsaving' : 'saving'} product:`, err),
    });
  }
}