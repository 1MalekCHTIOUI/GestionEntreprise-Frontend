import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriquesComponent } from './historiques/historiques.component';
import { ExceptionsComponent } from './exceptions/exceptions.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CreditsComponent } from './credits/credits.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { authGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full',
  },
  {
    path: 'historiques',
    component: HistoriquesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'errors',
    component: ExceptionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'inventaire',
    component: InventoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'credits',
    component: CreditsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: AuthenticationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
