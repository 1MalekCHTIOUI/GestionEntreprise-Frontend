import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFactureComponent } from './add-facture/add-facture.component';
import { ListFacturesComponent } from './list-factures/list-factures.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowFactureComponent } from './show-facture/show-facture.component';

const routes: Routes = [
  { path: 'factures/add-facture/:idDevis', component: AddFactureComponent },
  { path: 'factures', component: ListFacturesComponent },
  { path: 'factures/:id', component: ShowFactureComponent },
];

@NgModule({
  declarations: [
    AddFactureComponent,
    ListFacturesComponent,
    ShowFactureComponent,
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule],
})
export class FacturesModule {}
