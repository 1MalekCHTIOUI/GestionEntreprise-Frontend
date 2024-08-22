import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private config: Config) {}
  API = this.config.getAPIPath() + '/produits';
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}`);
  }

  getProductsPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${this.API}/allPaginate`, { params });
  }

  getProduct(id: any): Observable<any> {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  addProduct(product: any): Observable<any> {
    console.log('adding');

    return this.http.post<any>(`${this.API}/create`, product);
  }

  updateProduct(id: number, product: any): Observable<any> {
    product.append('_method', 'PUT');
    return this.http.post<any>(`${this.API}/edit/${id}`, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.API}/delete/${id}`);
  }

  addQteProduct(data: any): Observable<any> {
    return this.http.put<any>(`${this.API}/addQte`, data);
  }

  getProductByRef(ref: string): Observable<any> {
    return this.http.get<any>(`${this.API}/find/${ref}/ref`);
  }

  getProductByTitle(title: string): Observable<any> {
    console.log(title);

    return this.http.get<any>(`${this.API}/find/${title}/titre`);
  }

  search(ref: any, limit: number): Observable<any> {
    return this.http.get<any>(`${this.API}/search?query=${ref}&limit=${limit}`);
  }

  findByRefAndTitle(term: string): Observable<any> {
    return this.http.get<any>(`${this.API}/findByRefAndTitle/${term}`);
  }
}
