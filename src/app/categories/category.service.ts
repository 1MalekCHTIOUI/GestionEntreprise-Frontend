import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategoriesPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${API}/categories/allPaginate`, { params });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${API}/categories/all`);
  }

  getCatParents(): Observable<any> {
    return this.http.get(`${API}/categories`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get(`${API}/categories/${id}`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${API}/categories/create`, category);
  }

  updateCategory(category: any, id: string): Observable<any> {
    return this.http.put(`${API}/categories/edit/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${API}/categories/delete/${id}`);
  }
}
