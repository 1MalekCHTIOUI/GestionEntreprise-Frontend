import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal/modal.component';
import { Categorie } from '../../models/categorie.model';

@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.css'],
})
export class ListCategoriesComponent {
  categories: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  loaded = false;

  currentPage = 1;
  perPage = 10;
  totalItems = 0;
  constructor(
    private categoryService: CategoryService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getCategories();
  }

  getCategories(page: number = this.currentPage) {
    this.categoryService.getCategoriesPaginate(page).subscribe({
      next: (categories: any) => {
        console.log(categories);

        this.categories = categories.data;
        this.currentPage = categories.current_page;
        this.totalItems = categories.total;
        this.loaded = true;
      },
      error: (response) => {
        this.errorMessage = response.error.message;
        this.loaded = true;
      },
    });
  }

  goToPage(pageNumber: number) {
    this.getCategories(pageNumber);
  }

  deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category')) return;

    this.categoryService.deleteCategory(id).subscribe({
      next: (res) => {
        this.successMessage = 'Category deleted successfully';
        this.getCategories();
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

  openConfirmationModal(cat: Categorie) {
    const modalRef = this.modalService.open(ModalComponent);
    modalRef.componentInstance.title = 'Confirm Action';
    modalRef.componentInstance.message = `Are you sure you want to delete <strong>${cat.titreCateg}<strong>?`;

    modalRef.result.then((result) => {
      if (result === 'confirm') {
        if (cat.id !== undefined) {
          this.deleteCategory(cat.id);
        } else {
          this.errorMessage = 'Category ID is undefined';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      }
    });
  }
}
