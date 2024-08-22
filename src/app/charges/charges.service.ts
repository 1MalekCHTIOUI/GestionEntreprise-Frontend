import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { Observable } from 'rxjs';
import { Charge } from '../models/charge.model';

@Injectable({
  providedIn: 'root',
})
export class ChargesService {
  constructor(private http: HttpClient, private config: Config) {}
  private apiUrl = this.config.getAPIPath() + '/charges';

  getCharges(): Observable<Charge[]> {
    return this.http.get<Charge[]>(this.apiUrl);
  }

  getCharge(id: number): Observable<Charge> {
    return this.http.get<Charge>(`${this.apiUrl}/${id}`);
  }

  addCharge(charge: Charge): Observable<Charge> {
    return this.http.post<Charge>(this.apiUrl, charge);
  }

  updateCharge(id: number, charge: Charge): Observable<Charge> {
    return this.http.put<Charge>(`${this.apiUrl}/${id}`, charge);
  }

  deleteCharge(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
