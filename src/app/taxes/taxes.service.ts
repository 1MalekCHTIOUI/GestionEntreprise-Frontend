import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaxesService {
  constructor(private http: HttpClient, private config: Config) {}

  API = this.config.getAPIPath() + '/taxes';

  getTaxes() {
    return this.http.get(`${this.API}`);
  }

  getTaxe(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  addTaxe(data: any): Observable<any> {
    return this.http.post(`${this.API}`, data);
  }

  updateTaxe(id: number, data: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteTaxe(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  search(query: string, limit: number): Observable<any> {
    return this.http.get(`${this.API}/search?query=${query}&limit=${limit}`);
  }
}
