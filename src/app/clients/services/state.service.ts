import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State } from '../../models/interface/state.model';
import { Config } from '../../configs/config';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(private http: HttpClient, private config: Config) {}

  private apiUrl = this.config.getAPIPath();

  getStatesByCountry(countryId: number): Observable<State[]> {
    return this.http.get<State[]>(`${this.apiUrl}/states/country/${countryId}`);
  }
}
