import { Component } from '@angular/core';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent {
  title: string = '';
  description: string = '';
  categorie: number | null = null;
  categories: any = [];

  errorMessage: any = null;
  successMessage: any = null;
  id: string = '';
  constructor(
    private categService: CategoryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getCategories();
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.getCategory(+this.id);
  }

  onSubmit() {
    const cat = {
      titreCateg: this.title,
      descriptionCateg: this.description,
      categorie: Number(this.categorie),
    };

    this.categService.updateCategory(cat, this.id).subscribe({
      next: (res) => {
        this.successMessage = 'Category updated successfully';
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
        this.errorMessage = null;
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

  getCategory(id: number) {
    this.categService.getCategory(id).subscribe({
      next: (category: any) => {
        this.title = category.titreCateg;
        this.description = category.descriptionCateg;
        this.categorie = category.idParentCateg;
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.categorie = null;
  }
}
