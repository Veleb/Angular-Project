import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { catchError, map, of } from 'rxjs';
import { StorageService } from '../services/storage.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userService: UserService = inject(UserService);
  const storageService: StorageService = inject(StorageService);

  const user = storageService.getItem('user');

  if (user) {
    router.navigate(['/home']);
    return false;
  }

  return true;


  // when you change thiz to getProifle it workz from the loggedIn zide but not the guezt zide :(((((())))))
  // return userService.user$.pipe(
  //   map((user) => {
  //     if (user) {
  //       router.navigate(['/home']);
  //       return false;
  //     }
  //     return true;
  //   }),
  //   catchError((error) => {
  //     if (error.status === 401) {
  //       return of(true);
  //     }
  //     router.navigate(['/home']);
  //     return of(false);
  //   })
  // );


};
