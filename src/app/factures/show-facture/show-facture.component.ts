import { DatePipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../facture.service';
import { DevisService } from '../../devis/devis.service';
import { Config } from '../../configs/config';
import { TresorieService } from '../../tresorie/tresorie.service';

@Component({
  selector: 'app-show-facture',
  providers: [DatePipe],
  templateUrl: './show-facture.component.html',
  styleUrl: './show-facture.component.css',
})
export class ShowFactureComponent {
  uniqueRef: string = '';
  devis: any = null;
  parameters: any = null;
  date!: Date;
  facture: any = null;
  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private factureService: FactureService,
    private tresorieService: TresorieService,
    private router: Router,
    private config: Config,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getParams();

    this.route.params.subscribe((params) => {
      this.factureService.getFactureByDevis(params['id']).subscribe({
        next: (data: any) => {
          console.log(data);
          this.facture = data;
          this.getPaiements(data.ref);
          this.devis = data.devis;
          console.log(this.parameters);

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
          console.log(this.devis.taxes);

          this.date = new Date(data.date);
          this.uniqueRef = data.ref;
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }

  calculateTotalAvecPromoTaxe() {
    let totalHT = 0;

    this.devis.produits?.forEach((produit: any) => {
      totalHT += this.calculateTotalAvecPromoSansTaxe(
        produit,
        produit.pivot.qte
      );
    });

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

  calculateTotalAvecPromoSansTaxe(produit: any, quantity: number): number {
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
  printDevis() {
    window.print();
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
  paiements: any;
  getPaiements(numFac: string) {
    this.tresorieService.facturePaiements(numFac).subscribe({
      next: (data: any) => {
        console.log(data);

        this.paiements = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

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
