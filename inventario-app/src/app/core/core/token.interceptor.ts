import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { tap } from 'rxjs/operators';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    tap({
      error: (err) => {
        if (err.status === 401 || err.status === 403) {
          // opcional: mostrar toast y/o redirigir al login
          auth.logout(); // si tu logout ya limpia token y navega al /login
        }
      }
    })
  );
};
