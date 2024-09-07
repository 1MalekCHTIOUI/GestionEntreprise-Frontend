import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from '../configs/config';
import { Devis } from '../models/devis.model';
import { DevisItem } from '../models/devis-item.model';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class DevisService {
  constructor(private http: HttpClient, private config: Config) {}
  API = this.config.getAPIPath() + '/devis';

  getAllDevis(): Observable<Devis[]> {
    return this.http.get<Devis[]>(`${this.API}`);
  }

  getAllDevisPaginate(page: number): Observable<any[]> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get<any[]>(`${this.API}/allPaginate`, { params });
  }

  createDevis(Devis: any): Observable<any> {
    return this.http.post<Devis>(`${this.API}/create`, Devis);
  }

  getDevisById(id: number): Observable<Devis> {
    return this.http.get<Devis>(`${this.API}/${id}`);
  }

  updateDevis(id: number, Devis: any): Observable<any> {
    return this.http.put<Devis>(`${this.API}/edit/${id}`, Devis);
  }

  deleteDevis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/delete/${id}`);
  }

  getClients(): Observable<any[]> {
    return this.http.get<Client[]>(`${this.config.getAPIPath()}/clients`);
  }

  sendDevis(id: string): Observable<any> {
    return this.http.get<any>(
      `${this.config.getAPIPath()}/send-devis/${id}`,
      {}
    );
  }

  sendDevisAsPDF(pdf: any, idClient: any) {
    const formData = new FormData();
    formData.append('file', pdf);
    return this.http.post<any>(`${this.API}/send-pdf/${idClient}`, formData);
  }

  searchDevis(term: string): Observable<Devis> {
    return this.http.get<Devis>(`${this.API}/search/${term}`);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.patch<any>(`${this.API}/${id}/status`, { status });
  }

  getDevisServices(id: number): Observable<DevisItem[]> {
    return this.http.get<DevisItem[]>(`${this.API}/${id}/services`);
  }
}
