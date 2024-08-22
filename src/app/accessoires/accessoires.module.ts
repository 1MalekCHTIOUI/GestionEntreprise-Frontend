import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccessoireService } from './accessoire.service';
import { ListAccessoryComponent } from './list-accessory/list-accessory.component';
import { AddAccessoryComponent } from './add-accessory/add-accessory.component';
import { EditAccessoryComponent } from './edit-accessory/edit-accessory.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'accessoires',
    component: ListAccessoryComponent,
    title: 'Accessories List',
  },
  {
    path: 'accessoires/edit/:id',
    component: EditAccessoryComponent,
    title: 'Edit Accessories',
  },

  {
    path: 'accessoires/create',
    component: AddAccessoryComponent,
    title: 'Create Accessory',
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
