import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccessoireService {
  constructor(private http: HttpClient) {}

  getAccessoires(): Observable<any> {
    return this.http.get<any[]>(`${API}/accessoires`);
  }

  getAccessoiresPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${API}/accessoires/allPaginate`, { params });
  }

  getAccessoire(id: string): Observable<any> {
    return this.http.get(`${API}/accessoires/${id}`);
  }

  addAccessoire(accessoire: any): Observable<any> {
    return this.http.post(`${API}/accessoires/create`, accessoire);
  }

  updateAccessoire(accessoire: any, id: string): Observable<any> {
    accessoire.append('_method', 'PUT');
    return this.http.post(`${API}/accessoires/edit/${id}`, accessoire);
  }

  deleteAccessoire(id: string): Observable<any> {
    return this.http.delete(`${API}/accessoires/delete/${id}`);
  }

  addQteAccessory(data: any): Observable<any> {
    return this.http.put<any>(`${API}/accessoires/addQte`, data);
  }
}
