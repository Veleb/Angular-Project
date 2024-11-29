import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../environment';

const API = '/api';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  
  if (req.url.startsWith(API)) {
    req = req.clone({
      url: req.url.replace(API, environment.API_LINK),
      withCredentials: true,
    })
  }
  
  return next(req);
};
