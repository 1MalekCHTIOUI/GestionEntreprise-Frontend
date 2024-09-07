import { Component } from '@angular/core';
import { AuthService } from './users/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'GestionEntreprise';

  isAuthenticated: any = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getAuthState().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      console.log('isAuthenticated: ', isAuthenticated);
    });
  }
}
