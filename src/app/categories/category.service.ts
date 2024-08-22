import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient, private config: Config) {}
  API = this.config.getAPIPath() + '/categories';

  getCategoriesPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${this.API}/allPaginate`, { params });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.API}/all`);
  }

  getCatParents(): Observable<any> {
    return this.http.get(`${this.API}`);
  }

  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  addCategory(category: any): Observable<any> {
    return this.http.post(`${this.API}/create`, category);
  }

  updateCategory(category: any, id: string): Observable<any> {
    return this.http.put(`${this.API}/edit/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.API}/delete/${id}`);
  }
}
