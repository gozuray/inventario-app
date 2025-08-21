// src/app/app.ts
import { Component } from '@angular/core';              // 👈 importa Component
import { RouterOutlet } from '@angular/router';         // 👈 importa RouterOutlet
import { NavbarComponent } from './shared/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],             // 👈 úsalo aquí
  templateUrl: './app.html',
})
export class App {}
