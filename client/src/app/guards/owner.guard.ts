import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProductService } from '../products/product.service';
import { UserService } from '../user/user.service';
import { Product } from '../types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const ownerGuard: CanActivateFn = (route, state): Observable<boolean> => {
  const productId = route.params['id']; 

  const productService = inject(ProductService);
  const userService = inject(UserService);
  const router = inject(Router);
  
  return productService.getProductById(productId).pipe(
    map((productData: Product) => {
      const ownerId = productData._ownerId;
      const userId = userService.getUser?._id;
  
      if (ownerId === userId) {
        return true;
      } else {
        router.navigate([`/product/${productId}`]);
        return false;
      }
    })
  );
};
