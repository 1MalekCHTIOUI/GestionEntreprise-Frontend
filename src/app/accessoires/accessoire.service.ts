import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';
import { Accessoire } from '../models/accessoire.model';

@Injectable({
  providedIn: 'root',
})
export class AccessoireService {
  constructor(private http: HttpClient, private config: Config) {}

  API = this.config.getAPIPath() + '/accessoires';

  getAccessoires(): Observable<Accessoire[]> {
    return this.http.get<Accessoire[]>(`${this.API}`);
  }

  getAccessoiresPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());

    return this.http.get(`${this.API}/allPaginate`, {
      params,
    });
  }

  getAccessoire(id: string): Observable<Accessoire> {
    return this.http.get<Accessoire>(`${this.API}/${id}`);
  }

  addAccessoire(accessoire: any): Observable<Accessoire> {
    return this.http.post<Accessoire>(`${this.API}/create`, accessoire);
  }

  updateAccessoire(accessoire: any, id: string): Observable<Accessoire> {
    accessoire.append('_method', 'PUT');
    return this.http.post<Accessoire>(`${this.API}/edit/${id}`, accessoire);
  }

  deleteAccessoire(id: string): Observable<any> {
    return this.http.delete(`${this.API}/delete/${id}`);
  }

  addQteAccessory(data: any): Observable<any> {
    return this.http.put<any>(`${this.API}/addQte`, data);
  }

  getAccessoryByTitle(title: string): Observable<Accessoire[]> {
    return this.http.get<Accessoire[]>(`${this.API}/find/${title}/titre`);
  }
}
