import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  constructor(private http: HttpClient) {}

  addFacture(facture: FormData, idDevis: any) {
    return this.http.post(`${API}/factures/create/${idDevis}`, facture);
  }

  getFactures(): Observable<any> {
    return this.http.get(`${API}/factures`);
  }

  getFacturesPaginate(page: any): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(`${API}/factures/allPaginate`, { params });
  }

  getFacture(id: any): Observable<any> {
    return this.http.get(`${API}/factures/${id}`);
  }

  getFactureByDevis(id: any): Observable<any> {
    return this.http.get(`${API}/factures/devis/${id}`);
  }
}
