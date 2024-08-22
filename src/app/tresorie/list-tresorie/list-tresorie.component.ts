import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TresorieService } from '../tresorie.service';

@Component({
  selector: 'app-list-tresorie',
  templateUrl: './list-tresorie.component.html',
  styleUrl: './list-tresorie.component.css',
})
export class ListTresorieComponent {
  tresories: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  searchQuery: string = '';

  currentPage = 1;
  perPage = 10;
  totalItems = 0;

  constructor(
    private tresorieService: TresorieService,
    private modalService: NgbModal
  ) {}

  loaded = false;

  ngOnInit(): void {
    this.getAllTresories();
  }

  getAllTresories(pageNumber: number = this.currentPage) {
    this.tresorieService.getTresoriesPaginate(pageNumber).subscribe({
      next: (tresories: any) => {
        console.log(tresories);

        this.tresories = tresories.data;
        this.currentPage = tresories.current_page;
        this.totalItems = tresories.total;
        this.perPage = tresories.per_page;
        this.loaded = true;
      },
      error: (response) => {
        this.errorMessage = response.error.message;
        this.loaded = true;
      },
    });
  }

  deleteTresorie(id: string) {
    if (!confirm('Are you sure you want to delete this tresorie')) return;

    this.tresorieService.deleteTresorie(id).subscribe({
      next: (res) => {
        this.successMessage = 'Tresorie deleted successfully';
        this.getAllTresories();
      },
      error: (response) => {
        this.errorMessage = response.error.message;
      },
    });
  }

  goToPage(pageNumber: number) {
    this.getAllTresories(pageNumber);
  }

  searchTresorie() {
    this.tresorieService.searchTresorie(this.searchQuery).subscribe({
      next: (tresories: any) => {
        this.tresories = tresories.data;
        this.currentPage = tresories.current_page;
        this.totalItems = tresories.total;
        this.perPage = tresories.per_page;
      },
      error: (response) => {
        this.errorMessage = response.error.message;
      },
    });
  }
}
