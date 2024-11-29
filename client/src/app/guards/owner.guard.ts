import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProductService } from '../products/product.service';
import { UserService } from '../user/user.service';
import { Product } from '../types';

export const ownerGuard: CanActivateFn = (route, state) => {
  const productId = route.params['id'];
  let product!: Product;

  const productService = inject(ProductService);
  const userService = inject(UserService);
  const router = inject(Router);
  
  productService.getProductById(productId).subscribe({
    next: (productData) => {
      product = productData;
    }
  })

  const ownerId = product._ownerId;
  const userId = userService.getUser?._id;
  
  if (ownerId === userId) {
    return true;
  }

  router.navigate([`/product/${productId}`]);

  return false;
};
