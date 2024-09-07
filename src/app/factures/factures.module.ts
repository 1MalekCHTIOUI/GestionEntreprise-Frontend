import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFactureComponent } from './add-facture/add-facture.component';
import { ListFacturesComponent } from './list-factures/list-factures.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowFactureComponent } from './show-facture/show-facture.component';
import { NgxPrintModule } from 'ngx-print';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'factures/add-facture/:idDevis',
    component: AddFactureComponent,
    canActivate: [authGuard],
  },
  {
    path: 'factures',
    component: ListFacturesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'factures/:id',
    component: ShowFactureComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [
    AddFactureComponent,
    ListFacturesComponent,
    ShowFactureComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    NgxPrintModule,
  ],
})
export class FacturesModule {}
