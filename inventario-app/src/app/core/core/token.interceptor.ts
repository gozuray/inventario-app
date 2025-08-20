import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService) as AuthService;
  const token = (auth && typeof auth.getToken === 'function') ? auth.getToken() : null;

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    tap({
      error: (err: any) => {
        if (err?.status === 401 || err?.status === 403) {
          if (auth && typeof auth.clear === 'function') {
            auth.clear();
          }
        }
      }
    })
  );
};