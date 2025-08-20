import { Routes } from '@angular/router';
import { authGuard } from './core/auth-guard';
import { roleGuard } from './core/role-guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },

  { path: 'products', canActivate: [authGuard], loadComponent: () => import('./products/product-list.component').then(m => m.ProductListComponent) },
  { path: 'products/new', canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }, loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent) },
  { path: 'products/:id', canActivate: [authGuard, roleGuard], data: { roles: ['admin'] }, loadComponent: () => import('./products/product-form.component').then(m => m.ProductFormComponent) },

  { path: 'low-stock', canActivate: [authGuard], loadComponent: () => import('./products/low-stock.component').then(m => m.LowStockComponent) },

  { path: '', pathMatch: 'full', redirectTo: 'products' },
  { path: '**', redirectTo: 'products' }
];
