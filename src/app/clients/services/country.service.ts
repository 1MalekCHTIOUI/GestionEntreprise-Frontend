import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../../models/interface/country.model';
import { Config } from '../../configs/config';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  constructor(private http: HttpClient, private config: Config) {}

  private apiUrl = this.config.getAPIPath() + '/countries';

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiUrl);
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<Country>(`${this.apiUrl}/${id}`);
  }
}
