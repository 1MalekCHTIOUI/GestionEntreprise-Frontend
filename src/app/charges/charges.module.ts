import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListChargesComponent } from './list-charges/list-charges.component';
import { ChargesFormComponent } from './charges-form/charges-form.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const rotues: Routes = [
  { path: 'charges', component: ListChargesComponent },
  { path: 'charges/add', component: ChargesFormComponent },
  { path: 'charges/edit/:id', component: ChargesFormComponent },
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
