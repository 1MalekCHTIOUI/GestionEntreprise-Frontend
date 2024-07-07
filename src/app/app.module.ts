import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AccessoiresModule } from './accessoires/accessoires.module';
import { CategoriesModule } from './categories/categories.module';
import { DevisModule } from './devis/devis.module';
import { FacturesModule } from './factures/factures.module';
import { ProduitsModule } from './produits/produits.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { NavbarComponent } from './navbar/navbar.component';
import { ExceptionsComponent } from './exceptions/exceptions.component';
import { HistoriquesComponent } from './historiques/historiques.component';
import { InventoryComponent } from './inventory/inventory.component';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ModalComponent,
    HistoriquesComponent,
    ExceptionsComponent,
    InventoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CategoriesModule,
    AccessoiresModule,
    ProduitsModule,
    DevisModule,
    FacturesModule,
    NgbModule,
    // NgxPaginationModule
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],

  bootstrap: [AppComponent],
})
export class AppModule {}
