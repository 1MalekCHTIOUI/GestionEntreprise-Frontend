import { AuthService } from './../users/services/auth.service';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    console.log('Intercepted request URL:', req.url);

    if (req.url.includes('auth/login') || req.url.includes('verifyToken')) {
      return next.handle(req);
    }

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Handle 401 Unauthorized response
          alert('You are not authenticated. Please log in.');
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Handle 403 Forbidden response
          alert('You are not authorized to access this resource.');
          // this.router.navigate(['/forbidden']); // Adjust the route as needed
        }
        return throwError(error);
      })
    );
  }
}
