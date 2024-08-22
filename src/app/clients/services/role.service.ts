import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../../models/interface/role.model';
import { Config } from '../../configs/config';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient, private config: Config) {}

  private apiUrl = this.config.getAPIPath() + '/roles';

  getRoles(): Observable<Role[]> {
    return this.http
      .get<{ success: boolean; data: Role[] }>(this.apiUrl)
      .pipe(map((response) => response.data));
  }

  createRole(role: Role): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  updateRole(id: number, role: Role): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
