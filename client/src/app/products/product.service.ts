import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product, ProductDataInterface } from '../types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/products`);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`/api/products/${productId}`);
  }

  deleteProductById(productId: string | undefined): Observable<Product> {
    return this.http.delete<Product>(`/api/products/${productId}`);
  }
  
  createProduct(productData: ProductDataInterface): Observable<Product> {
    return this.http.post<Product>('/api/products', productData);
  }

  saveProduct(productId: string): Observable<Product> {
    return this.http.post<Product>(`/api/products/save/${productId}`, {});
  }

  unsaveProduct(productId: string): Observable<Product> {
    return this.http.delete<Product>(`/api/products/save/${productId}`, {});
  }

  getUserSavedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`/api/products/saved`);
  }

}
