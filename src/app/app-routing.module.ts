import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoriquesComponent } from './historiques/historiques.component';
import { ExceptionsComponent } from './exceptions/exceptions.component';
import { InventoryComponent } from './inventory/inventory.component';
import { CreditsComponent } from './credits/credits.component';

const routes: Routes = [
  {
    path: 'historiques',
    component: HistoriquesComponent,
  },
  {
    path: 'errors',
    component: ExceptionsComponent,
  },
  {
    path: 'inventaire',
    component: InventoryComponent,
  },
  {
    path: 'credits',
    component: CreditsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
