import { Component, Input, OnInit } from '@angular/core';
import { AuthUser, Product } from '../../types';
import { RouterLink } from '@angular/router';
import { UserService } from '../../user/user.service';
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [ RouterLink ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit{
  @Input() product!: Product;
  @Input() user: AuthUser | null = null;
  owner: AuthUser | null = null;
  isOwner: boolean | null = null;

  constructor(private userService: UserService) {}

  favoriteProduct(productId: string): void {
    // check if user has already liked the post and make call to api with the product id and the user id that youll get
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
  }
}
