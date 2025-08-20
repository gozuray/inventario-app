// src/app/core/auth.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { config } from './config';

interface LoginResponse {
  token: string;
}

interface DecodedToken {
  role?: 'ADMIN' | 'EMPLEADO';
  name?: string;
  email?: string;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // Llamada al backend para login
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${config.baseUrl}/auth/login`, { email, password });
  }

  // Guardar token en localStorage (solo si estamos en navegador)
  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  // Obtener token actual
  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  // Eliminar token (logout)
  clear() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Verifica si el usuario está autenticado y el token no está vencido
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    return decoded?.exp ? Date.now() < decoded.exp * 1000 : true;
  }

  // Devuelve el rol del usuario (ADMIN o EMPLEADO)
  getRole(): string {
    return this.decodeToken(this.getToken() || '')?.role ?? '';
  }

  // Devuelve el nombre o correo del usuario
  getUserName(): string {
    const decoded = this.decodeToken(this.getToken() || '');
    return decoded?.name || decoded?.email || '';
  }

  // Decodifica el JWT manualmente
  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
      const json = atob(padded);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }
}
