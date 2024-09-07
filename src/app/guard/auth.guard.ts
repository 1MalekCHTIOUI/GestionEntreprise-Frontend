import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../users/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getAuthState().pipe(
    map((isAuthenticated: boolean): boolean | UrlTree => {
      if (isAuthenticated) {
        return true;
      } else {
        console.log('You are not authenticated');
        return router.parseUrl('/login');
      }
    })
  );
};
