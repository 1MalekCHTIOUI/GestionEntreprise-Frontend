import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShowProductComponent } from './show-product/show-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

const routes: Routes = [
  {
    path: 'products/create',
    component: AddProductComponent,
    title: 'Create product',
  },
  {
    path: 'products/edit/:id',
    component: EditProductComponent,
    title: 'Edit product',
  },
  {
    path: 'products/:id',
    component: ShowProductComponent,
    title: 'Product details',
  },
  { path: 'products', component: ListProductComponent, title: 'Products List' },
];

@NgModule({
  declarations: [
    AddProductComponent,
    EditProductComponent,
    ListProductComponent,
    ShowProductComponent,
    TruncatePipe,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgbModule,
  ],
})
export class ProduitsModule {}
