import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsPageComponent } from './clients-page/clients-page.component';
import { EditClientComponent } from './edit-client/edit-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxEditorModule } from 'ngx-editor';
import { RouterModule, Routes } from '@angular/router';
import { ClientsListComponent } from './clients-list/clients-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { authGuard } from '../guard/auth.guard';

const routes: Routes = [
  {
    path: 'clients/add',
    component: AddClientComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clients/edit/:id',
    component: EditClientComponent,
    canActivate: [authGuard],
  },
  {
    path: 'clients',
    component: ClientsListComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  declarations: [
    ClientsPageComponent,
    EditClientComponent,
    AddClientComponent,
    ClientsListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    FileUploadModule,
    NgxEditorModule,
    FileUploadModule,
    MatCardModule,
    MatDatepickerModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatIconModule,
  ],
})
export class ClientsModule {}
