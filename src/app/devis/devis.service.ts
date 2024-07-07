import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../configs/config';

@Injectable({
  providedIn: 'root',
})
export class DevisService {
  constructor(private http: HttpClient) {}

  getAllDevis(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/devis`);
  }

  getAllDevisPaginate(page: number): Observable<any[]> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get<any[]>(`${API}/devis/allPaginate`, { params });
  }

  createDevis(Devis: any): Observable<any> {
    return this.http.post<any>(`${API}/devis/create`, Devis);
  }

  getDevisById(id: number): Observable<any> {
    return this.http.get<any>(`${API}/devis/${id}`);
  }

  updateDevis(id: number, Devis: any): Observable<any> {
    return this.http.put<any>(`${API}/devis/edit/${id}`, Devis);
  }

  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${API}/devis/delete/${id}`);
  }

  getClients(): Observable<any> {
    return this.http.get<any>(`${API}/clients`);
  }
}
