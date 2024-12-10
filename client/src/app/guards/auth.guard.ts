import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router)
  const userService: UserService = inject(UserService);
  const toastr: ToastrService = inject(ToastrService);

  const isLogged: boolean = userService.isLogged; 

  if (isLogged) {
    return true;
  }
  
  toastr.error('Unauthorized!', `Error Occurred`);
  router.navigate(['/login'])

  return false;
};
