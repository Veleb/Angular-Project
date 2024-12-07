import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { catchError, map, of } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const storageService: StorageService = inject(StorageService);

  const user = storageService.getItem('user');

  if (user) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
