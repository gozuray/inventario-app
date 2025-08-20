import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductService } from './product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private service = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = this.route.snapshot.paramMap.get('id');
  loading = signal(false);
  error = signal<string | null>(null);
  title = this.id ? 'Editar producto' : 'Nuevo producto';

  form = this.fb.group<Product>({
    _id: undefined as any,
    name: '' as any,
    description: '' as any,
    price: 0 as any,
    quantity: 0 as any,
    category: '' as any
  });

  ngOnInit() {
    if (this.id) {
      this.loading.set(true);
      this.service.get(this.id).subscribe({
        next: (p) => { this.form.patchValue(p); this.loading.set(false); },
        error: (e) => { this.error.set('No se pudo cargar'); this.loading.set(false); }
      });
    }
  }

  save() {
    if (this.form.invalid) return;
    this.error.set(null);
    this.loading.set(true);

    const dto = { ...this.form.value } as Product;
    if (dto.quantity! < 0) { this.error.set('La cantidad no puede ser negativa'); this.loading.set(false); return; }

    const op = this.id ? this.service.update(this.id!, dto) : this.service.create(dto);

    op.subscribe({
      next: () => { this.loading.set(false); this.router.navigate(['/products']); },
      error: (e) => { this.loading.set(false); this.error.set(e?.error?.message || 'Error guardando'); }
    });
  }
}
