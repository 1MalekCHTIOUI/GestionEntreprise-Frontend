import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { FactureService } from '../facture.service';
import {
  HttpClient,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DevisService } from '../../devis/devis.service';
import { TresorieService } from '../../tresorie/tresorie.service';
import { Config } from '../../configs/config';
@Component({
  selector: 'app-add-facture',
  templateUrl: './add-facture.component.html',
  styleUrls: ['./add-facture.component.css'],
  providers: [DatePipe],
})
export class AddFactureComponent {
  uniqueRef: string = '';
  devis: any = null;
  date!: Date;
  parameters: any = null;
  success: string = '';
  error: string = '';
  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private factureService: FactureService,
    private router: Router,
    private datePipe: DatePipe,

    private tresorieService: TresorieService,

    private config: Config,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getParams();

    this.route.params.subscribe((params) => {
      this.devisService.getDevisById(params['idDevis']).subscribe({
        next: (data: any) => {
          this.devis = data;

          // this.getPaiements(data.ref);

          this.devis.taxes.push(
            {
              name: 'Droit Timbre',
              rate: null,
            },
            {
              name: 'TVA',
              rate: this.parameters.tva,
            },
            {
              name: 'Fodec',
              rate: this.parameters.fodec,
            }
          );

          console.log(this.devis);
          this.date = new Date(data.date);
          this.uniqueRef = data.ref;
        },
        error: (error: HttpResponse<any>) => {
          if (error.status == 404) {
            console.log(error);
            this.router.navigate(['/factures']);
            return;
          }
        },
      });
    });
  }

  saveFacture() {
    const facture: { [key: string]: any } = {
      ref: this.uniqueRef,
      date: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      totalHT: this.calculateTotalAvecPromoAvecTaxe().totalHT,
      totalTTC: this.calculateTotalAvecPromoAvecTaxe().totalTTC,
      idDevis: this.devis.id,
    };
    const formData = new FormData();
    for (const key in facture) {
      if (facture.hasOwnProperty(key)) {
        formData.append(key, facture[key]);
      }
    }
    this.factureService.addFacture(formData, this.devis.id).subscribe({
      next: (data) => {
        console.log(data);
        this.error = '';
        this.success = 'Facture ajoutée avec succès';
      },
      error: (error) => {
        console.log(error);
        this.error = error.error.message;
      },
    });
  }

  calculateTotalAvecPromoAvecTaxe() {
    let totalHT = 0;

    this.devis.produits?.forEach((produit: any) => {
      totalHT += this.calculateTotalProdAvecPromoSansTaxe(
        produit,
        produit.pivot.qte
      );
    });

    totalHT += this.getFraisLivraison();
    totalHT += this.totalServices();

    let totalTTC = totalHT;
    this.devis.taxes?.forEach((tax: any) => {
      if (tax.rate) {
        totalTTC += totalHT * (tax.rate / 100);
      } else if (tax.name == 'Droit Timbre') {
        console.log(this.parameters.timbre_fiscale);

        totalTTC += Number(this.parameters.timbre_fiscale);
      }
    });

    return { totalHT, totalTTC };
  }

  calculateTotalProdAvecPromoSansTaxe(produit: any, quantity: number): number {
    let total =
      quantity >= produit.qteMinGros
        ? quantity * produit.prixGros
        : quantity * produit.prixVente;
    if (produit.promo) {
      total -= total * (produit.promo / 100);
    }
    return total;
  }

  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
  }

  getParams() {
    this.http.get(`${this.config.getAPIPath()}/parameters/1`).subscribe({
      next: (data: any) => {
        console.log(data);

        this.parameters = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getFacNumber(fac: string) {
    return fac.split('FAC-')[1];
  }

  calculateValue(number: number, rate: number): number {
    const rateInDecimal = rate / 100;
    return number * rateInDecimal;
  }

  getFraisLivraison(): number {
    let fraisTotal = 0;
    this.devis.produits.forEach((item: any) => {
      if (item.fraisTransport) {
        fraisTotal += item.fraisTransport;
      }
    });
    return fraisTotal;
  }
  // paiements: any;
  // getPaiements(numFac: string) {
  //   this.tresorieService.facturePaiements(numFac).subscribe({
  //     next: (data: any) => {
  //       console.log(data);

  //       this.paiements = data;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //   });
  // }

  calculateTotalProdSansPromoSansTaxe(produit: any, quantity: number): number {
    let total =
      quantity >= produit.qteMinGros
        ? quantity * produit.prixGros
        : quantity * produit.prixVente;

    return total;
  }

  totalServices(): number {
    let total = 0;
    this.devis.items.forEach((item: any) => {
      total += Number(item.cost);
    });
    return total;
  }

  productsWithPromo(): any[] {
    return (this.devis.produits as any[]).filter(
      (product: any) => product.promo
    );
  }
}
