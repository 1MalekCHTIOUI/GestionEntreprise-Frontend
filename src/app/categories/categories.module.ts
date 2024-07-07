import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { ListCategoriesComponent } from './list-categories/list-categories.component';
import { RouterModule, Routes } from '@angular/router';
// import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

const routes: Routes = [
  {
    path: 'categories/create',
    component: AddCategoryComponent,
    title: 'Create category',
  },
  {
    path: 'categories/edit/:id',
    component: EditCategoryComponent,
    title: 'Edit category',
  },
  {
    path: 'categories',
    component: ListCategoriesComponent,
    title: 'Categories list',
  },
];

@NgModule({
  declarations: [
    ListCategoriesComponent,
    AddCategoryComponent,
    EditCategoryComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NgxPaginationModule,
    NgbModule,
  ],
})
export class CategoriesModule {}
