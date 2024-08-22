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
        next: (data: any) => {
          this.devis = data;
          this.devis.taxes.push(
            {
              name: 'Droit Timbre',
              rate: null,
            },
            {
              name: 'TVA',
              rate: this.parameters.tva,
            }
          );
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
        console.log(data);

        this.parameters = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  calculateTotalAvecPromoTaxe() {
    let totalHT = 0;

    this.devis.produits.forEach((produit: any) => {
      totalHT += this.calculateTotalAvecPromoSansTaxe(
        produit,
        produit.pivot.qte
      );
    });

    let totalTTC = totalHT;
    console.log(this.devis.taxes);

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

  calculateValue(number: number, rate: number): number {
    const rateInDecimal = rate / 100;
    return number * rateInDecimal;
  }

  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
  }

  getDevNumber(devis: string) {
    return devis.split('DEV-')[1];
  }

  returnNumberText(number: number) {
    return this.toWords.convert(number) ?? 0;
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

  public sendAsPDF() {
    var data = document.getElementById('printable'); //Id of the table
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button) => (button.style.display = 'none'));

    if (data) {
      html2canvas(data).then((canvas) => {
        // Few necessary setting options
        let imgWidth = 208;
        let pageHeight = 295;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
        let position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        // let generatedPdf = pdf.save('MYPdf.pdf'); // Generated PDF
        const pdfBlob = pdf.output('blob');
        const reader = new FileReader();
        reader.readAsDataURL(pdfBlob);
        reader.onloadend = () => {
          const base64data = reader.result;
          console.log(base64data);
          console.log(this.devis.client.id);

          // Send base64 PDF to backend
          this.devisService
            .sendDevisAsPDF(base64data, this.devis.client.id)
            .subscribe((response) => {
              console.log('PDF sent to backend', response);
            });
        };
      });
    }
    buttons.forEach((button) => (button.style.display = 'inline-block'));
  }

  getFraisLivraison(): number {
    let fraisTotal = 0;
    this.devis.produits.forEach((item: any) => {
      console.log('Produit trans', item);

      fraisTotal += item.fraisTransport;
    });
    return fraisTotal;
  }
}
