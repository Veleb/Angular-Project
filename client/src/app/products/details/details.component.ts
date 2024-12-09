import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthUser, Product, Room } from '../../types';
import { UserService } from '../../user/user.service';
import { RoomService } from '../../chats/room.service';

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
    private roomService: RoomService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {

      const productId = params.get('id')

        if (productId) {
          this.productService.getProductById(productId).subscribe({
            next: (productData: Product) => {
              this.product = productData; 
            },
            error: (err) => console.error(`Error fetching product by id: ${err}`)
          });
        }

      });

    this.user = this.userService.getUser;
  }

  deleteProduct(productId: string | undefined): void {
    this.productService.deleteProductById(productId).subscribe({
      next: () =>  this.router.navigate(['/catalog']),
      error: (err) => console.error(`Error deleting product by id: ${err}`)
    });
  }
  
  startChat(product: Product | null, ownerId: string | undefined): void {
    
    if (!this.user?._id || !ownerId) {
      throw new Error('Invalid user or owner ID');
      return;
    }
    
    const userId: string  = this.user?._id;
    const productId: string | undefined = product?._id;
    
    const users: string[] = [ userId, ownerId ]; 
    const name: string | undefined = product?.name;

    this.roomService.createRoom({ name, messages: [], users, owner: ownerId, product: productId })
    .subscribe({

      next: (room: Room) => {
        if (room._id && product?._id) {

          this.router.navigate([`/chat/${productId}/${room._id}`]);

        } else {  
          throw new Error(`Room or product ID is missing`);
        }
      },

      error: (err) => {
        throw new Error(`Error creating room: ${err}`);
      }
    });
  }
}
