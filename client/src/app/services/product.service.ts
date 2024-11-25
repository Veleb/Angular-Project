import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../types';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  API_LINK = environment.API_LINK;
  
  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.API_LINK + '/products');
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(this.API_LINK + `/products/${productId}`);
  }

  deleteProductById(productId: string | undefined): Observable<Product> {
    return this.http.delete<Product>(this.API_LINK + `/products/${productId}`);
  }
  
}
