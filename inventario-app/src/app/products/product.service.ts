import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
}

export interface ProductQuery {
  name?: string;
  category?: string;
  page?: number;
  limit?: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private api = `${environment.baseUrl}/products`; // Changed from apiUrl to baseUrl

  list(query: ProductQuery = {}): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<Product[]>(this.api, { params });
  }

  get(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.api}/${id}`);
  }

  create(dto: Product): Observable<Product> {
    return this.http.post<Product>(this.api, dto);
  }

  update(id: string, dto: Product): Observable<Product> {
    return this.http.put<Product>(`${this.api}/${id}`, dto);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  // ✅ corregido para usar environment.apiUrl y responseType
  downloadLowStockPdf(): Observable<Blob> {
    return this.http.get(`${environment.baseUrl}/reports/low-stock`, { // Changed from apiUrl to baseUrl
      responseType: 'blob'
    });
  }
}
