import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router)

  const isLogged: boolean = false; // change to auth service check if the user is logged in 

  if (isLogged) {
    return true;
  }
  
  router.navigate(['/login'])

  return false;
};
