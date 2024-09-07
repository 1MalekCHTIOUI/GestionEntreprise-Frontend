import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Config } from '../../configs/config';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private config: Config) {
    // this.isAuthenticated().subscribe();
    // console.log('AuthService constructor');
  }
  router = inject(Router);
  private loginUrl = this.config.getAPIPath() + '/auth/login';
  private isAuth: boolean = false;
  private authState = new BehaviorSubject<boolean>(this.hasToken());

  login(credentials: any): Observable<any> {
    return this.http.post(this.loginUrl, credentials).pipe(
      tap((response: any) => {
        if (response && response.access_token) {
          this.setToken(response.access_token);
          this.isAuth = true;
          this.authState.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    this.authState.next(false);
    this.router.navigateByUrl('/login');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private hasToken(): boolean {
    const token = this.getToken();
    return token !== null && token !== undefined && token !== '';
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }
  isAuthenticated(): Observable<boolean> {
    if (!this.hasToken()) {
      // If no token is found, immediately mark the user as unauthenticated
      this.authState.next(false);
      return of(false);
    }

    // Verify the token if it exists
    return this.verifyToken().pipe(
      map((res: HttpResponse<any>) => {
        if (res.status === 200) {
          // Token is valid, update the authentication state
          this.authState.next(true);
          return true;
        } else {
          // Token is invalid, update the authentication state
          this.authState.next(false);
          return false;
        }
      }),
      catchError((err) => {
        // Handle errors during token verification
        console.error('Token verification failed:', err);
        this.authState.next(false);
        return of(false);
      })
    );
  }

  private verifyToken(): Observable<any> {
    const token = this.getToken();
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.get<any>(this.config.getAPIPath() + '/verifyToken', {
      headers,
      observe: 'response',
    });
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
