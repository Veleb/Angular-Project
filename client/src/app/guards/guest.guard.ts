import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { ToastrService } from 'ngx-toastr';

export const guestGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const storageService: StorageService = inject(StorageService);
  const toastr: ToastrService = inject(ToastrService);

  const user = storageService.getItem('user');

  if (user) {
    toastr.info('Already logged in!', `Info`);
    router.navigate(['/home']);
    return false;
  }

  return true;
};
