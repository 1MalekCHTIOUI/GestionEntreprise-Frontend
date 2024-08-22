import { Component } from '@angular/core';
import { TresorieService } from '../tresorie/tresorie.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.css',
})
export class CreditsComponent {
  credits: any[] = [];
  searchQuery: string = '';

  currentPage = 1;
  perPage = 10;
  totalItems = 0;
  searchType: string = 'clientName';
  constructor(private tresService: TresorieService) {}

  ngOnInit(): void {
    this.getAllCreditsPaginate();
  }

  getAllCreditsPaginate(pageNumber: number = 1) {
    this.tresService.getCreditsPaginate(pageNumber).subscribe({
      next: (credits: any) => {
        console.log(credits);

        this.credits = credits.data;
        this.currentPage = credits.current_page;
        this.totalItems = credits.total;
        this.perPage = credits.per_page;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  searchCreditByClientName(clientName: string) {
    if (clientName === '') return this.getAllCreditsPaginate();
    this.tresService
      .findCreditByClientNamePaginate(clientName, this.currentPage)
      .subscribe({
        next: (credits: any) => {
          console.log(credits);

          this.credits = credits.data;
          this.currentPage = credits.current_page;
          this.totalItems = credits.total;
          this.perPage = credits.per_page;
        },
        error: (response) => {
          console.log(response);
        },
      });
  }

  searchCreditByFactureRef(numFacture: string) {
    if (numFacture === '') return this.getAllCreditsPaginate();
    this.tresService
      .findCreditByFactureRefPaginate(numFacture, this.currentPage)
      .subscribe({
        next: (credits: any) => {
          console.log(credits);

          this.credits = credits.data;
          this.currentPage = credits.current_page;
          this.totalItems = credits.total;
          this.perPage = credits.per_page;
        },
        error: (response) => {
          console.log(response);
        },
      });
  }

  goToPage(pageNumber: number) {
    this.getAllCreditsPaginate(pageNumber);
  }

  searchCredit() {
    if (this.searchType === 'clientName')
      this.searchCreditByClientName(this.searchQuery);
    else if (this.searchType === 'factureRef')
      this.searchCreditByFactureRef(this.searchQuery);
    else this.getAllCreditsPaginate();
  }
}
