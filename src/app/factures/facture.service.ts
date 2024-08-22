import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FactureService {
  constructor(private http: HttpClient, private config: Config) {}
  API = this.config.getAPIPath() + '/factures';

  addFacture(facture: FormData, idDevis: any) {
    return this.http.post(`${this.API}/create/${idDevis}`, facture);
  }

  getFactures(): Observable<any> {
    return this.http.get(`${this.API}`);
  }

  getFacturesPaginate(page: any): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.API}/allPaginate`, { params });
  }

  getFacture(id: any): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  getFactureByDevis(id: any): Observable<any> {
    return this.http.get(`${this.API}/devis/${id}`);
  }

  getRemainingBalance(numFact: string): Observable<any> {
    return this.http.get(`${this.API}/remainingBalance/${numFact}`);
  }
}
