import { Component } from '@angular/core';
import { DevisService } from '../devis.service';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-list-devis',
  templateUrl: './list-devis.component.html',
  styleUrls: ['./list-devis.component.css'],
})
export class ListDevisComponent {
  devisList!: any[];
  currentPage = 1;
  perPage = 10;
  totalItems = 0;

  constructor(
    private devisService: DevisService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadDevis();
    console.log(this.loadDevis());
  }

  loadDevis(page: number = this.currentPage) {
    this.devisService.getAllDevisPaginate(page).subscribe({
      next: (acc: any) => {
        console.log(acc);

        this.devisList = acc.data;
        this.currentPage = acc.current_page;
        this.totalItems = acc.total;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  deleteDevis(id: string): void {
    this.devisService.deleteDevis(+id).subscribe(() => {
      this.loadDevis();
    });
  }
  selectedDevis!: any;
  setSelectedDevis(devis: any) {
    console.log(devis);

    this.selectedDevis = devis;
  }

  openConfirmationModal(id: string) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Confirm Action';
    modalRef.componentInstance.message = `Are you sure you want to delete this devis?`;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteDevis(id);
      }
    });
  }

  goToPage(pageNumber: number) {
    this.loadDevis(pageNumber);
  }
}
