import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TresorieService {
  constructor(private http: HttpClient, private config: Config) {}

  API = this.config.getAPIPath() + '/tresorie';

  getTresoriesPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.API}/allPaginate`, { params });
  }

  getTresories(): Observable<any> {
    return this.http.get(`${this.API}`);
  }

  getTresorie(id: string): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  addTresorie(tresorie: any): Observable<any> {
    return this.http.post(`${this.API}`, tresorie);
  }

  updateTresorie(id: string, tresorie: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, tresorie);
  }

  deleteTresorie(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  searchTresorie(term: string): Observable<any> {
    return this.http.get(`${this.API}/search/${term}`);
  }

  searchFactures(term: string): Observable<any> {
    return this.http.get<any>(
      `${this.API}/autocomplete-facture?search=${term}`
    );
  }
  facturePaiements(id: string): Observable<any> {
    return this.http.get(`${this.API}/facturePaiements/${id}`);
  }

  findCreditByClientNamePaginate(
    clientName: string,
    page: number
  ): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(
      `${this.config.getAPIPath()}/credits/searchByClientName/${clientName.trim()}`,
      {
        params,
      }
    );
  }

  findCreditByFactureRefPaginate(
    numFacture: string,
    page: number
  ): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(
      `${this.config.getAPIPath()}/credits/searchByFactureRef/${numFacture.trim()}`,
      {
        params,
      }
    );
  }

  getCreditsPaginate(page: number): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    return this.http.get(`${this.config.getAPIPath()}/credits/allPaginate`, {
      params,
    });
  }
}
