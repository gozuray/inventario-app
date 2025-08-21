import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <!-- Logo / marca -->
      <div class="brand">📦 Inventario</div>

      <!-- Links -->
      <div class="links">
        <a routerLink="/productos">Productos</a>
        <a routerLink="/reportes" *ngIf="isAdmin()">Reportes</a>
      </div>

      <!-- Usuario -->
      <div class="user" *ngIf="user() as u">
        <span>{{ u.name || u.email }}</span>
        <button (click)="logout()">Salir</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: .75rem 1.5rem;
      background: #1a202c; /* gris oscuro elegante */
      color: #fff;
      font-family: system-ui, sans-serif;
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    .brand {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .links {
      display: flex;
      gap: 1rem;
    }
    .links a {
      color: #e2e8f0;
      text-decoration: none;
      transition: color .2s;
    }
    .links a:hover {
      color: #fff;
    }
    .user {
      display: flex;
      align-items: center;
      gap: .5rem;
    }
    .user span {
      font-size: .9rem;
      opacity: .85;
    }
    button {
      background: #e53e3e;
      border: none;
      color: white;
      padding: .35rem .7rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: .85rem;
    }
    button:hover {
      background: #c53030;
    }
  `]
})
export class NavbarComponent {
  private auth = inject(AuthService);
  user = signal(this.auth.getUser());

  isAdmin() {
    return this.user()?.role === 'ADMIN';
  }

  logout() {
    this.auth.clear();
    location.href = '/login';
  }
}
