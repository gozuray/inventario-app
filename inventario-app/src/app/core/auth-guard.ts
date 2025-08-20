// src/app/core/auth-guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, _state) => {
  const platformId = inject(PLATFORM_ID);
  const auth = inject(AuthService);
  const router = inject(Router);

  // ✅ En SSR (no hay localStorage), dejamos pasar para renderizar
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // ✅ En navegador: valida token
  if (auth.isLoggedIn()) {
    return true;
  }

  // Si no está logueado → redirige a login
  return router.createUrlTree(['/login']);
};
