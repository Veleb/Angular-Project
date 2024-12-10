import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environments/environment';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorMsgService } from './core/error-msg/error-msg.service';

const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  const errorMsgService = inject(ErrorMsgService);

  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace(API, environment.API_LINK),
      withCredentials: true,
    });
  }

  return next(req).pipe(
    catchError((err) => {
      let errorMessage;

      if (err.status === 404) {
        errorMessage = err.statusText;  
      }
      else if (err.status === 401) {
        errorMessage = err.statusText;
      }
      else {
        errorMessage = err.error?.message || 'An unexpected error occurred';
      }

      errorMsgService.setError(errorMessage);
      
      return throwError(() => err);
    })
  );
};
