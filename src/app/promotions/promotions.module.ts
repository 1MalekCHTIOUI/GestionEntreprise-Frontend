import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListPromotionsComponent } from './list-promotions/list-promotions.component';
import { FormPromotionsComponent } from './form-promotions/form-promotions.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: 'promotions',
    component: ListPromotionsComponent,
  },
  {
    path: 'promotions/add',
    component: FormPromotionsComponent,
  },
  {
    path: 'promotions/edit/:id',
    component: FormPromotionsComponent,
  },
];

@NgModule({
  declarations: [ListPromotionsComponent, FormPromotionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbModule
  ],
})
export class PromotionsModule {}
