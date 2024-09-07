import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TresorieFormComponent } from './tresorie-form/tresorie-form.component';
import { ListTresorieComponent } from './list-tresorie/list-tresorie.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'tresorie',
    component: ListTresorieComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tresorie/add',
    component: TresorieFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tresorie/edit/:id',
    component: TresorieFormComponent,
    canActivate: [authGuard],
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
