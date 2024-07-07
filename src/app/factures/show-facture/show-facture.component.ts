import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../facture.service';
import { DevisService } from '../../devis/devis.service';

@Component({
  selector: 'app-show-facture',
  providers: [DatePipe],
  templateUrl: './show-facture.component.html',
  styleUrl: './show-facture.component.css',
})
export class ShowFactureComponent {
  uniqueRef: string = '';
  devis: any = null;
  date!: Date;
  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private factureService: FactureService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.factureService.getFactureByDevis(params['id']).subscribe({
        next: (data: any) => {
          console.log(data);

          this.devis = data.devis;
          this.date = new Date(data.date);
          this.uniqueRef = data.ref;
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }
  calculateTotalAvecPromoTVA() {
    let totalHT = 0;
    let totalTTC = 0;
    this.devis.produits.forEach((produit: any) => {
      totalHT += this.calculateTotalAvecPromoSansTVA(
        produit,
        produit.pivot.qte
      );
    });

    totalTTC = totalHT + totalHT * (this.devis.tva / 100);

    return { totalHT, totalTTC };
  }

  calculateTotalAvecPromoSansTVA(produit: any, quantity: number): number {
    let total =
      quantity >= produit.qteMinGros
        ? quantity * produit.prixGros
        : quantity * produit.prixVente;
    if (produit.promo) {
      total -= total * (produit.promo / 100);
    }
    return total;
  }
}
