import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { PlatformService } from '@service/platform.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const platform = inject(PlatformService);

  // Check if the platform is a browser
  if (!platform.isbrowser()) {
    return next(req);
  }
  
  // Skip adding token for /user/login requests
  if (req.url.includes('/user/login')) {
    return next(req);
  }

  const token = localStorage.getItem('auth_token');


  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
