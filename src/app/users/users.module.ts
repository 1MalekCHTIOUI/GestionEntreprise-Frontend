import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users/list-users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'users',
    component: ListUsersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users/create',
    component: AddUserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users/edit/:id',
    component: EditUserComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [ListUsersComponent, AddUserComponent, EditUserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class UsersModule {}
