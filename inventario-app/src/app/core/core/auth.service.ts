import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(private http: HttpClient) {}

  // Login al backend
  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${config.baseUrl}/auth/login`, { email, password });
  }

  // Guardar token
  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // Obtener token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Eliminar token (logout)
  clear() {
    localStorage.removeItem(this.tokenKey);
  }

  // Verificar si hay sesión válida
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    return decoded?.exp ? Date.now() < decoded.exp * 1000 : true;
  }

  // Obtener rol
  getRole(): 'ADMIN' | 'EMPLEADO' | null {
    return this.decodeToken(this.getToken() || '')?.role ?? null;
  }

  // Obtener nombre de usuario
  getUserName(): string {
    return this.decodeToken(this.getToken() || '')?.name ?? '';
  }

  // Decodificar JWT
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
