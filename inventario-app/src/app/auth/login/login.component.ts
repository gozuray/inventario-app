// src/app/auth/login.component.ts  (ajusta la ruta si difiere)
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { catchError, finalize, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  submit() {
    if (this.form.invalid || this.loading()) return;

    this.errorMsg.set(null);
    this.loading.set(true);

    const { email, password } = this.form.value;

    this.auth.login(email!, password!).pipe(
      tap(res => {
        // 1) Guardar token
        this.auth.setToken(res.token);
      }),
      tap(() => {
        // 2) Navegar tras éxito
        this.router.navigateByUrl('/products');
      }),
      catchError(err => {
        const msg = err?.error?.message || err?.message || 'Error de autenticación';
        this.errorMsg.set(msg);
        return EMPTY; // corta la cadena para que no llegue al subscribe next
      }),
      finalize(() => {
        // 3) Siempre apagar loading
        this.loading.set(false);
      })
    ).subscribe();
  }
}
