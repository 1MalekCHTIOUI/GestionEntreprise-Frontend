import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListChargesComponent } from './list-charges/list-charges.component';
import { ChargesFormComponent } from './charges-form/charges-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authGuard } from '../guard/auth.guard';

const rotues: Routes = [
  {
    path: 'charges',
    component: ListChargesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'charges/add',
    component: ChargesFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'charges/edit/:id',
    component: ChargesFormComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [ListChargesComponent, ChargesFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(rotues),
  ],
})
export class ChargesModule {}
