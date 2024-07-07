import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDevisComponent } from './list-devis/list-devis.component';
import { AddDevisComponent } from './add-devis/add-devis.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EditDevisComponent } from './edit-devis/edit-devis.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: 'devis',
    component: ListDevisComponent,
  },
  {
    path: 'devis/create',
    component: AddDevisComponent,
  },

  {
    path: 'devis/edit/:id',
    component: EditDevisComponent,
  },
];

@NgModule({
  declarations: [ListDevisComponent, AddDevisComponent, EditDevisComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
})
export class DevisModule {}
