import { Component } from '@angular/core';
import { FactureService } from '../facture.service';

@Component({
  selector: 'app-list-factures',
  templateUrl: './list-factures.component.html',
  styleUrls: ['./list-factures.component.css'],
})
export class ListFacturesComponent {
  factures: any[] = [];
  currentPage = 1;
  perPage = 10;
  totalItems = 0;
  constructor(private factureService: FactureService) {}

  ngOnInit(): void {
    this.loadFactures();
  }

  loadFactures(page: number = this.currentPage) {
    this.factureService.getFacturesPaginate(page).subscribe({
      next: (acc: any) => {
        console.log(acc);

        this.factures = acc.data;
        this.currentPage = acc.current_page;
        this.totalItems = acc.total;
        this.perPage = acc.per_page;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  goToPage(pageNumber: number) {
    this.loadFactures(pageNumber);
  }

  selectedDevis!: any;
  setSelectedDevis(devis: any) {
    console.log(devis);

    this.selectedDevis = devis;
  }
}
