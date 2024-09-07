import { Component, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { Categorie } from '../../models/categorie.model';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  merge,
  Observable,
  OperatorFunction,
  Subject,
  switchMap,
} from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.css'],
})
export class EditCategoryComponent {
  title: string = '';
  description: string = '';
  categorie: any | null = null;
  categories: any = [];

  errorMessage: any = null;
  successMessage: any = null;
  id: string = '';
  constructor(
    private categService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private config: Config
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
      categorie: Number(this.categorie.id),
    };

    console.log(cat);

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
      next: (categories: Categorie[]) => {
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
        console.log(category);

        this.title = category.titreCateg;
        this.description = category.descriptionCateg;
        this.categorie = this.categories.find(
          (c: Categorie) => c.id === category.idParentCateg
        );
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

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead;

  loading = false;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  searchCategories(term: string): Observable<any[]> {
    this.loading = true;

    if (term === '') {
      return this.categService
        .search('', this.config.AUTOCOMPLETE_INITIAL)
        .pipe(finalize(() => (this.loading = false)));
    } else {
      return this.categService
        .search(term, this.config.AUTOCOMPLETE_SEARCH_LIMIT)
        .pipe(finalize(() => (this.loading = false)));
    }
  }

  searchCategorie: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    console.log(this.categories);

    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.click$.pipe(
      filter(() => !this.instance.isPopupOpen())
    );
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      switchMap((term) => this.searchCategories(term))
    );
  };
  formatResult = (result: any) => {
    console.log(result.titreCateg);

    return result.titreCateg;
  };
}
