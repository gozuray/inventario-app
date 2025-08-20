import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Product, ProductService } from './product.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private router = inject(Router);

  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  filters = this.fb.group({
    name: [''],
    category: ['']
  });

  constructor() {
    const sub = this.filters.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.fetch());

    effect(() => { this.fetch(); });
  }

  fetch() {
    this.loading.set(true);
    this.error.set(null);
    const { name, category } = this.filters.value;
    this.service.list({ name: name || '', category: category || '' }).subscribe({
      next: (list) => {
        this.products.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.error?.message || 'Error cargando productos');
      }
    });
  }

  create() { this.router.navigate(['/products/new']); }
  edit(p: Product) { this.router.navigate(['/products', p._id]); }
  remove(p: Product) {
    if (!p._id || !confirm(`Eliminar "${p.name}"?`)) return;
    this.service.remove(p._id).subscribe({
      next: () => this.fetch(),
      error: (err) => this.error.set(err?.error?.message || 'No se pudo eliminar')
    });
  }
}
