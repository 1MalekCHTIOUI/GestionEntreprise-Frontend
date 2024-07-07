import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit {
  title: string = '';
  description: string = '';
  parentCategory = null;
  categories: any = [];
  errorMessage: any = null;
  successMessage: any = null;
  constructor(private categService: CategoryService) {}

  ngOnInit() {
    this.getCategories();
  }

  onSubmit() {
    // if (!this.description || !this.title) return;

    const category = {
      titreCateg: this.title,
      descriptionCateg: this.description,
      categorie: this.parentCategory,
    };

    console.log(category);

    this.categService.addCategory(category).subscribe({
      next: (res) => {
        this.successMessage = 'Category added successfully';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.errorMessage = null;
        this.resetForm();
      },
      error: (response) => {
        console.log(response);
        this.errorMessage = response.error.message;
      },
    });
  }

  getCategories() {
    this.categService.getCatParents().subscribe({
      next: (categories: any) => {
        console.log(categories);

        this.categories = categories;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.parentCategory = null;
  }
}
