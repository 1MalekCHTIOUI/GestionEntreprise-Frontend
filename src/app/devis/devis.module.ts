import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDevisComponent } from './list-devis/list-devis.component';
import { AddDevisComponent } from './add-devis/add-devis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EditDevisComponent } from './edit-devis/edit-devis.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FactureAccessoiresComponent } from './facture-accessoires/facture-accessoires.component';
import { ShowDevisComponent } from './show-devis/show-devis.component';
import { NgxPrintModule } from 'ngx-print';
import { FeatureModule } from '../feature/feature.module';
import { AddDevis2Component } from './add-devis2/add-devis2.component';
import { EditDevis2Component } from './edit-devis2/edit-devis2.component';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'devis',
    component: ListDevisComponent,
    canActivate: [authGuard],
  },
  {
    path: 'devis/create',
    component: AddDevisComponent,
    canActivate: [authGuard],
  },
  {
    path: 'devis/create2',
    component: AddDevis2Component,
    canActivate: [authGuard],
  },
  {
    path: 'devis/accessoires/:id',
    component: FactureAccessoiresComponent,
    canActivate: [authGuard],
  },

  {
    path: 'devis/edit/:id',
    component: EditDevisComponent,
    canActivate: [authGuard],
  },
  {
    path: 'devis/edit2/:id',
    component: EditDevis2Component,
    canActivate: [authGuard],
  },
  {
    path: 'devis/:id',
    component: ShowDevisComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [
    ListDevisComponent,
    AddDevisComponent,
    EditDevisComponent,
    FactureAccessoiresComponent,
    ShowDevisComponent,
    AddDevis2Component,
    EditDevis2Component,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    NgxPrintModule,
    FeatureModule,
  ],
})
export class DevisModule {}
