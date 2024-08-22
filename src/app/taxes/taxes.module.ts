import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ListTaxesComponent } from './list-taxes/list-taxes.component';
import { TaxesFormComponent } from './taxes-form/taxes-form.component';

const routes: Routes = [
  { path: 'taxes', component: ListTaxesComponent },
  { path: 'taxes/add', component: TaxesFormComponent },
  { path: 'taxes/edit/:id', component: TaxesFormComponent },
];

@NgModule({
  declarations: [ListTaxesComponent, TaxesFormComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TaxesModule {}
