import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessoireService } from './accessoire.service';
import { ListAccessoryComponent } from './list-accessory/list-accessory.component';
import { AddAccessoryComponent } from './add-accessory/add-accessory.component';
import { EditAccessoryComponent } from './edit-accessory/edit-accessory.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'accessoires',
    component: ListAccessoryComponent,
    title: 'Accessories List',
    canActivate: [authGuard],
  },
  {
    path: 'accessoires/edit/:id',
    component: EditAccessoryComponent,
    title: 'Edit Accessories',
    canActivate: [authGuard],
  },

  {
    path: 'accessoires/create',
    component: AddAccessoryComponent,
    title: 'Create Accessory',
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [
    ListAccessoryComponent,
    AddAccessoryComponent,
    EditAccessoryComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    RouterModule.forChild(routes),
    NgbModule,
  ],
  exports: [],
})
export class AccessoiresModule {}
