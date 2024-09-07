import { DatePipe } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from '../../factures/facture.service';
import { DevisService } from '../devis.service';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../configs/config';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ToWords } from 'to-words';
import { Devis } from '../../models/devis.model';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-show-devis',
  templateUrl: './show-devis.component.html',
  styleUrl: './show-devis.component.css',
  providers: [DatePipe],
})
export class ShowDevisComponent {
  devis: any = null;
  date!: Date;
  parameters: any;

  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private router: Router,
    private config: Config,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getParams();
    this.route.params.subscribe((params) => {
      this.devisService.getDevisById(params['id']).subscribe({
        next: (data: Devis) => {
          this.devis = data;
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
          console.log(this.devis.items);

          this.date = new Date(data.date);
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }

  printDevis() {
    window.print();
  }

  getParams() {
    this.http.get(`${this.config.getAPIPath()}/parameters/1`).subscribe({
      next: (data: any) => {
        this.parameters = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  productsWithPromo(): any[] {
    return (this.devis.produits as any[]).filter(
      (product: any) => product.promo
    );
  }
  PrixGrosOrVente(produit: any, qte: number) {
    return produit.qteMinGros < qte ? produit.prixGros : produit.prixVente;
  }

  calculateTotalProd(
    promo: boolean,
    produit: Produit,
    quantity: number
  ): number {
    let total = quantity * this.PrixGrosOrVente(produit, quantity);
    if (promo && produit.promo) {
      total -= total * (+produit.promo / 100);
    }
    return total;
  }
  calculateValue(number: number, rate: number): number {
    const rateInDecimal = rate / 100;
    return number * rateInDecimal;
  }

  returnImg(image: string) {
    const path = this.config.getPhotoPath('parameters') + image;
    console.log(path);

    return path;
  }

  getDevNumber(devis: string) {
    return devis.split('DEV-')[1];
  }

  returnNumberText(number: number) {
    const n: number = parseFloat(number.toFixed(2));
    return this.toWords.convert(n) ?? 0;
  }

  toWords = new ToWords({
    localeCode: 'fr-FR',
    converterOptions: {
      currency: false,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
    },
  });
  sending = false;
  public sendAsPDF() {
    var data = document.getElementById('printable'); //Id of the table
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => (button.style.display = 'none'));

    if (data) {
      setTimeout(() => {
        alert('Veuillez patienter pendant la génération du PDF');
      }, 3000);
      html2canvas(data, { scale: 1 }).then((canvas) => {
        // Few necessary setting options
        let imgWidth = 210; // 210mm converted to pixels at 72dpi
        let pageHeight = 297; // 297mm converted to pixels at 72dpi
        let imgHeight = (canvas.height * imgWidth) / canvas.width;

        let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        let position = 0;

        pdf.addImage(canvas, 'PNG', 0, position, imgWidth, pageHeight);

        const pdfBlob = pdf.output('blob');
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          const base64data = reader.result;
          this.sending = true;
          this.devisService
            .sendDevisAsPDF(base64data, this.devis.client.id)
            .subscribe({
              next: (data: any) => {
                console.log(data);
                this.sending = false;
                alert('Devis envoyé avec succès');
              },
              error: (error) => {
                this.sending = false;
                console.log(error);
              },
            });
        };
      });
    }
    buttons.forEach((button) => (button.style.display = 'inline-block'));
  }
}
