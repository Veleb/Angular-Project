import { Component, Input, OnInit } from '@angular/core';
import { AuthUser, Product } from '../../types';
import { RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit{
  @Input() product!: Product;
  
  user: AuthUser | null = null;
  owner: AuthUser | null = null;

  isOwner: boolean | null = null;
  isSaved: boolean | undefined;

  constructor(private userService: UserService, private productService: ProductService) {}

  favoriteProduct(productId: string): void {
    const savedProducts: string[] | undefined = this.userService.getSavedProducts;
    const hasSaved: boolean | undefined = savedProducts?.includes(productId);
    
    if (hasSaved) {
      this.productService.unsaveProduct(productId).subscribe({
        next: (res) => {
          this.isSaved = false;
            this.user!.savedProducts = savedProducts?.filter(id => id !== productId) || [];
        },
        error: (error) => {
          console.error('Error unsaving product:', error);
        }
      }
      );
    } else {
      this.productService.saveProduct(productId).subscribe({
        next: (res) => {
          this.isSaved = true;
          this.user!.savedProducts = [...(savedProducts || []), productId];
        },
        error: (error) => {
          console.error('Error saving product:', error);
        }
      }
      );
    }
    
  }

  ngOnInit(): void {
    const ownerId = this.product._ownerId;

    this.userService.fetchProfile(ownerId).subscribe({
      next: (userData: AuthUser) => {
        this.owner = userData;
      }
    });

    this.user = this.userService.getUser;
    this.isOwner = this.product._ownerId === this.user?._id;
    this.isSaved = this.userService.getSavedProducts?.includes(this.product._id) ?? false;
  }
}
