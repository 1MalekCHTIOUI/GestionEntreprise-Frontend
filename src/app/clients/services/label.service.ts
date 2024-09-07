import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Label } from '../../models/label.model';
import { Config } from '../../configs/config';

@Injectable({
  providedIn: 'root',
})
export class LabelService {
  constructor(private http: HttpClient, private config: Config) {}

  private baseUrl = this.config.getAPIPath();

  getLabels(): Observable<{ success: boolean; data: Label[] }> {
    return this.http.get<{ success: boolean; data: Label[] }>(
      this.baseUrl + '/labels'
    );
  }
}
