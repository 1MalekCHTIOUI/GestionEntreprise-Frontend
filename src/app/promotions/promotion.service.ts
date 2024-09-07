import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private http: HttpClient, private config: Config) {}

  API = this.config.getAPIPath() + '/promotions';

  getPromotions(): Observable<any> {
    return this.http.get(`${this.API}`);
  }

  addPromotion(promotion: any): Observable<any> {
    return this.http.post(`${this.API}`, promotion);
  }

  getPromotionById(id: number): Observable<any> {
    return this.http.get(`${this.API}/${id}`);
  }

  updatePromotion(id: number, promotion: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, promotion);
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.config.getAPIPath()}/clients`);
  }

  searchClientByName(name: string) {
    return this.http.get(`${this.config.getAPIPath()}/clients/search/${name}`);
  }

  async sendPromotion(promotions: any[], clients: any[]): Promise<boolean> {
    const clientIds = clients.map((client) => client.id);
    const requests = promotions.map((element: any) => {
      return lastValueFrom(
        this.http.post<any>(
          `${this.config.getAPIPath()}/send-promotion/${element.id}`,
          {
            clients: clientIds,
          }
        )
      );
    });

    try {
      const responses = await Promise.all(requests);
      console.log('All promotions sent successfully', responses);
      return true; // All requests succeeded
    } catch (error) {
      console.error('Error sending promotions', error);
      return false; // At least one request failed
    }
  }

  // sendPromotion(promotions: any[], clients: any[]): Observable<boolean> {
  //   const clientIds = clients.map((client) => client.id);
  //   if (!promotions || !Array.isArray(promotions) || promotions.length === 0) {
  //     return of(false);
  //   }

  //   const requests: Observable<any>[] = promotions.map((element: any) =>
  //     this.http
  //       .post<any>(`${API}/send-promotion/${element.id}`, {
  //         clients: clientIds,
  //       })
  //       .pipe(
  //         catchError((error) => {
  //           console.error('Error sending promotion:', error);
  //           return of(null); // Return null or any other value indicating failure
  //         })
  //       )
  //   );

  //   return forkJoin(requests).pipe(
  //     map((responses: any[]) => {
  //       // Check if all responses are non-null (successful)
  //       return responses.every((response) => response !== null);
  //     })
  //   );
  // }
}
