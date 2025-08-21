// src/app/core/login-block-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loginBlockGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está logueado, lo mandamos a /products
  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/products']);
  }

  // Si no está logueado, permitimos acceso a la página de login
  return true;
};
