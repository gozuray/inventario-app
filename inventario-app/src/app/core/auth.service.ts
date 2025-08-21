// src/app/core/auth.service.ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { config } from './config';

interface LoginResponse {
  token: string;
}

export type UserRole = 'ADMIN' | 'EMPLEADO';

interface DecodedToken {
  sub?: string;       // id de usuario (opcional según tu backend)
  role?: UserRole;
  name?: string;
  email?: string;
  exp?: number;       // Unix seconds
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // === Auth API ===
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${config.baseUrl}/auth/login`, { email, password });
  }

  // === Token helpers ===
  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId)
      ? localStorage.getItem(this.tokenKey)
      : null;
  }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // === Session state ===
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const decoded = this.decodeToken(token);
    // Si no hay 'exp', asumimos válido (depende de tu backend)
    return decoded?.exp ? Date.now() < decoded.exp * 1000 : true;
  }

  // Alias para compatibilidad con guards que llamen isAuthenticated()
  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  // === User info (para navbar, guards, etc.) ===
  getRole(): UserRole | '' {
    return this.decodeToken(this.getToken() || '')?.role ?? '';
  }

  getUserName(): string {
    const decoded = this.decodeToken(this.getToken() || '');
    return decoded?.name || decoded?.email || '';
  }

  /** Devuelve un objeto de usuario decodificado desde el JWT (o null si no hay token) */
  getUser(): { id?: string; email?: string; name?: string; role?: UserRole } | null {
    const t = this.getToken();
    if (!t) return null;
    const d = this.decodeToken(t);
    if (!d) return null;
    return {
      id: d.sub,
      email: d.email,
      name: d.name,
      role: d.role,
    };
  }

  // === Internal ===
  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;

      // Normaliza base64url -> base64
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');

      const json = this.b64Decode(padded);
      return json ? JSON.parse(json) as DecodedToken : null;
    } catch {
      return null;
    }
  }

  // Decodifica base64 tanto en browser como en SSR (Node)
  private b64Decode(str: string): string {
    try {
      // Browser
      // eslint-disable-next-line no-undef
      if (typeof atob === 'function') {
        // eslint-disable-next-line no-undef
        return atob(str);
      }
    } catch { /* ignore */ }

    try {
      // Node / SSR
      // eslint-disable-next-line no-undef
      if (typeof Buffer !== 'undefined') {
        // eslint-disable-next-line no-undef
        return Buffer.from(str, 'base64').toString('utf-8');
      }
    } catch { /* ignore */ }

    return '';
  }
}
