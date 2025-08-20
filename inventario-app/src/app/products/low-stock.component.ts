import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductService } from './product.service';

@Component({
  selector: 'app-low-stock',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './low-stock.component.html'
})
export class LowStockComponent {
  private service = inject(ProductService);
  products = signal<Product[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loading.set(true);
    this.service.list({}) // Si tu backend expone endpoint dedicado, cámbialo a /products/low-stock
      .subscribe({
        next: (list) => {
          this.products.set(list.filter(p => (p.quantity ?? 0) < 5));
          this.loading.set(false);
        },
        error: (e) => { this.error.set('No se pudo cargar'); this.loading.set(false); }
      });
  }

  downloadPdf() {
    this.loading.set(true);
    this.service.downloadLowStockPdf().subscribe({
      next: (blob: any) => {
        this.loading.set(false);
        const file = new Blob([blob.body ?? blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'low-stock.pdf';
        a.click();
        URL.revokeObjectURL(url);
      },
      error: (e) => { this.loading.set(false); this.error.set('No se pudo descargar el PDF'); }
    });
  }
}
