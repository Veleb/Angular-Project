import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorMsgService } from './core/error-msg/error-msg.service';

const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  
  const router = inject(Router);
  const errorMsgService = inject(ErrorMsgService);

  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace(API, environment.API_LINK),
      withCredentials: true,
    })
  }
  
  return next(req)
  .pipe(
    catchError((err) => {
      if (err.status === 401) {
        errorMsgService.setError(err);
        // router.navigate(['/login']);
      } else {
        errorMsgService.setError(err);
      }

      return [err];
    })
  );
};
