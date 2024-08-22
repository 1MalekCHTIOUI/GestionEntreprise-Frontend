import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TresorieFormComponent } from './tresorie-form/tresorie-form.component';
import { ListTresorieComponent } from './list-tresorie/list-tresorie.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tresorie',
    component: ListTresorieComponent,
  },
  {
    path: 'tresorie/add',
    component: TresorieFormComponent,
  },
  {
    path: 'tresorie/edit/:id',
    component: TresorieFormComponent,
  },
];

@NgModule({
  declarations: [
    TresorieFormComponent,
    ListTresorieComponent,
    AutocompleteComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class TresorieModule {}
