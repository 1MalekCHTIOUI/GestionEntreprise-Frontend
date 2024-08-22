import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../models/interface/client.model';
import { Config } from '../../configs/config';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient, private config: Config) {}

  private apiUrl = this.config.getAPIPath() + '/clients';

  getClients(): Observable<{ clients: Client[] }> {
    return this.http.get<{ clients: Client[] }>(this.apiUrl);
  }
  getClientsPagniate(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/allPaginate');
  }
  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  // addClient(clientData: Client, file: File | null): Observable<any> {
  //   const formData = new FormData();
  //   Object.keys(clientData).forEach((key) => {
  //     formData.append(key, (clientData as any)[key]);
  //   });
  //   if (file) {
  //     formData.append('logo', file);
  //   }

  //   return this.http.post(this.apiUrl, formData);
  // }

  addClient(clientData: Client, file: File | null): Observable<any> {
    const formData = new FormData();
    Object.keys(clientData).forEach((key) => {
      formData.append(key, (clientData as any)[key]);
    });
    if (file) {
      formData.append('logo', file);
    }

    return this.http.post(this.apiUrl, formData);
  }

  updateClient(id: number, client: any): Observable<any> {
    client.append('_method', 'PUT');
    return this.http.post<any>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
