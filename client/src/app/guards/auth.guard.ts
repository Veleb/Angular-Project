import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { firstValueFrom, Observable, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router)
  const userService: UserService = inject(UserService);

  const isLogged: boolean = userService.isLogged; 
  // const hasToBeUser: boolean | undefined = route.data?.['hasToBeUser'];


  if (isLogged) {
    return true;
  }
  
  router.navigate(['/login'])

  return false;
};
