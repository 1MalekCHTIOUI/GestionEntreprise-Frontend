import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../../configs/config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private http: HttpClient, private config: Config) {}
  private apiUrl = this.config.getAPIPath() + '/permissions';
  getPermissions(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  createPermission(permission: any): Observable<any> {
    return this.http.post(this.apiUrl, permission);
  }

  updatePermission(id: number, permission: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, permission);
  }

  deletePermission(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPermission(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
