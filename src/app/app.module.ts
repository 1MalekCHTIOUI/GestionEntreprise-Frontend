import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccessoiresModule } from './accessoires/accessoires.module';
import { CategoriesModule } from './categories/categories.module';
import { DevisModule } from './devis/devis.module';
import { FacturesModule } from './factures/factures.module';
import { ProduitsModule } from './produits/produits.module';
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
import { ParametersModule } from './parameters/parameters.module';
import { TaxesModule } from './taxes/taxes.module';
import { TresorieModule } from './tresorie/tresorie.module';
import { CreditsComponent } from './credits/credits.component';
import { PromotionsModule } from './promotions/promotions.module';
import { Config } from './configs/config';
import { ChargesModule } from './charges/charges.module';
import { StatistiquesModule } from './statistiques/statistiques.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ClientsModule } from './clients/clients.module';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ModalComponent,
    HistoriquesComponent,
    ExceptionsComponent,
    InventoryComponent,
    CreditsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,

    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CategoriesModule,
    AccessoiresModule,
    ProduitsModule,
    DevisModule,
    FacturesModule,
    ParametersModule,
    TaxesModule,
    TresorieModule,
    PromotionsModule,
    ChargesModule,
    StatistiquesModule,
    ClientsModule,
    NgbModule,
    // NgxPaginationModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    Config,
    provideAnimationsAsync(),
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
