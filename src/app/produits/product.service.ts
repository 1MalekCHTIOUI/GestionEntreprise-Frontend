import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API, BASE_API_URL } from '../configs/config';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/produits`);
  }

  getProductsPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${API}/produits/allPaginate`, { params });
  }

  getProduct(id: any): Observable<any> {
    return this.http.get<any>(`${API}/produits/${id}`);
  }

  addProduct(product: any): Observable<any> {
    console.log('adding');

    return this.http.post<any>(`${API}/produits/create`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    product.append('_method', 'PUT');
    return this.http.post<any>(`${API}/produits/edit/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${API}/produits/delete/${id}`);
  }

  addQteProduct(data: any): Observable<any> {
    return this.http.put<any>(`${API}/produits/addQte`, data);
  }

  getProductByRef(ref: string): Observable<any> {
    return this.http.get<any>(`${API}/produits/find/${ref}`);
  }
}
