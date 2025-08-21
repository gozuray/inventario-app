// src/app/core/token.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      // Si el backend devuelve 401/403, limpiamos sesión y vamos a /login
      if (err.status === 401 || err.status === 403) {
        auth.clear();
        // Evita bucles: sólo navega si no estás ya en /login
        if (!router.url.startsWith('/login')) {
          router.navigateByUrl('/login');
        }
      }
      return throwError(() => err);
    })
  );
};
