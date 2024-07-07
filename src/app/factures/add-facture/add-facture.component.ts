import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { FactureService } from '../facture.service';
import { HttpResponse, HttpResponseBase } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DevisService } from '../../devis/devis.service';
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
  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private factureService: FactureService,
    private router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.devisService.getDevisById(params['idDevis']).subscribe({
        next: (data: any) => {
          this.devis = data;
          console.log(data);
          this.date = new Date();

          this.generateUniqueRef();
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

  generateUniqueRef(): void {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const uuid = uuidv4().split('-').slice(0, 3).join('-');

    const random = Math.floor(Math.random() * 10000);
    this.uniqueRef = `FAC-${date}-${uuid}-${random}`;
  }

  saveFacture() {
    const facture: { [key: string]: any } = {
      ref: this.uniqueRef,
      date: this.datePipe.transform(this.date, 'yyyy-MM-dd HH:mm:ss'),
      totalHT: this.calculateTotalAvecPromoTVA().totalHT,
      totalTTC: this.calculateTotalAvecPromoTVA().totalTTC,
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
        location.reload();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
}
