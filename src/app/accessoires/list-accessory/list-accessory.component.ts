import { Component } from '@angular/core';
import { AccessoireService } from '../accessoire.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BASE_API_URL } from '../../configs/config';
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-list-accessory',
  templateUrl: './list-accessory.component.html',
  styleUrls: ['./list-accessory.component.css'],
})
export class ListAccessoryComponent {
  accessoires: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  loaded = false;
  currentPage = 1;
  perPage = 10;
  totalItems = 0;
  constructor(
    private accService: AccessoireService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAccessoires();
  }

  getAccessoires(page: number = this.currentPage) {
    this.accService.getAccessoiresPaginate(page).subscribe({
      next: (acc: any) => {
        console.log(acc);

        this.accessoires = acc.data;
        this.currentPage = acc.current_page;
        this.totalItems = acc.total;
        this.loaded = true;
      },
      error: (response) => {
        this.errorMessage = response.error.message;
        this.loaded = true;
      },
    });
  }

  goToPage(pageNumber: number) {
    this.getAccessoires(pageNumber);
  }

  deleteAcc(id: string) {
    if (!confirm('Are you sure you want to delete this accessory')) return;

    this.accService.deleteAccessoire(id).subscribe({
      next: (res) => {
        this.successMessage = 'Accessory deleted successfully';
        this.getAccessoires();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (response) => {
        this.errorMessage = response.error.message;
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
    });
  }

  returnImg(image: any) {
    return BASE_API_URL + image;
  }

  openConfirmationModal(acc: any) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Confirm Action';
    modalRef.componentInstance.message = `Are you sure you want to delete <strong>${acc.titre}</strong>?`;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteAcc(acc.id);
      }
    });
  }
}
