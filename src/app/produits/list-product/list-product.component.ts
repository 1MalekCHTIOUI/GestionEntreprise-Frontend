import { Component } from '@angular/core';
import { ProductService } from '../product.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal/modal.component';
import { BASE_API_URL } from '../../configs/config';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css'],
})
export class ListProductComponent {
  products: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';

  currentPage = 1;
  perPage = 10;
  totalItems = 0;
  constructor(
    private pService: ProductService,
    private modalService: NgbModal
  ) {}
  loaded = false;

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(pageNumber: number = this.currentPage) {
    this.pService.getProductsPaginate(pageNumber).subscribe({
      next: (products: any) => {
        console.log(products);

        this.products = products.data;
        this.currentPage = products.current_page;
        this.totalItems = products.total;
        this.loaded = true;
      },
      error: (response) => {
        this.errorMessage = response.error.message;
        this.loaded = true;
      },
    });
  }

  deleteProduct(id: number) {
    if (!confirm('Are you sure you want to delete this product')) return;

    this.pService.deleteProduct(id).subscribe({
      next: (res) => {
        this.successMessage = 'Product deleted successfully';
        this.getAllProducts();
      },
      error: (response) => {
        this.errorMessage = response.error.message;
      },
    });
  }
  goToPage(pageNumber: number) {
    this.getAllProducts(pageNumber);
  }

  returnImg(img: string) {
    return BASE_API_URL + img;
  }

  openConfirmationModal(prod: any) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Confirm Action';
    modalRef.componentInstance.message = `Are you sure you want to delete <strong>${prod.titre}</strong>?`;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        this.deleteProduct(prod.id);
      }
    });
  }
}
