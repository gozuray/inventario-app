import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // o usa tu core/config.ts
import { baseUrl } from '../core/config'; // si ya lo tienes, usa este import

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
  private api = `${baseUrl}/products`; // ajusta si tu endpoint es distinto

  list(query: ProductQuery = {}): Observable<Product[]> {
    let params = new HttpParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, String(v));
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

  downloadLowStockPdf(): Observable<Blob> {
    return this.http.get(`${baseUrl}/reports/low-stock`, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(response => response as unknown as Observable<Blob>);
  }
}
