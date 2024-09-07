import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowParameterComponent } from './show-parameter/show-parameter.component';
import { AddParameterComponent } from './add-parameter/add-parameter.component';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'parameters/edit',
    component: AddParameterComponent,
    canActivate: [authGuard],
  },
  {
    path: 'parameters',
    component: ShowParameterComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [ShowParameterComponent, AddParameterComponent],
  imports: [CommonModule, FormsModule, RouterModule.forChild(routes)],
})
export class ParametersModule {}
