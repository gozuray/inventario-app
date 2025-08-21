import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { config } from './config';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

export type UserRole = 'ADMIN' | 'EMPLEADO';

interface DecodedToken {
  sub?: string;
  role?: UserRole;
  name?: string;
  email?: string;
  exp?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'token';
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private http = inject(HttpClient);

  // Señal reactiva con la información del usuario
  userSignal = signal<{ id?: string; email?: string; name?: string; role?: UserRole } | null>(this.getUser());

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${config.baseUrl}/auth/login`, { email, password });
  }

  setToken(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.tokenKey, token);
      this.userSignal.set(this.getUser()); // Actualiza la señal
    }
  }

  getToken(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(this.tokenKey) : null;
  }

  clear() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.tokenKey);
      this.userSignal.set(null); // Actualiza la señal
    }
  }

  logout() {
    this.clear();
    this.router.navigateByUrl('/login');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    return decoded?.exp ? Date.now() < decoded.exp * 1000 : true;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getRole(): UserRole | '' {
    return this.userSignal()?.role ?? '';
  }

  getUserName(): string {
    const user = this.userSignal();
    return user?.name || user?.email || '';
  }

  getUser(): { id?: string; email?: string; name?: string; role?: UserRole } | null {
    const t = this.getToken();
    if (!t) return null;
    const d = this.decodeToken(t);
    if (!d) return null;
    return { id: d.sub, email: d.email, name: d.name, role: d.role };
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1];
      if (!payload) return null;
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4 || 4)) % 4, '=');
      const json = this.b64Decode(padded);
      return json ? JSON.parse(json) as DecodedToken : null;
    } catch {
      return null;
    }
  }

  private b64Decode(str: string): string {
    try {
      if (typeof atob === 'function') {
        return atob(str);
      }
    } catch { /* ignore */ }
    try {
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(str, 'base64').toString('utf-8');
      }
    } catch { /* ignore */ }
    return '';
  }
}