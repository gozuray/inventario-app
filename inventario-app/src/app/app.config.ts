// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { tokenInterceptor } from './core/token.interceptor'; // 👈 corregida la ruta

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),                        // 👈 agrega fetch para SSR
      withInterceptors([tokenInterceptor])
    )
  ]
};
