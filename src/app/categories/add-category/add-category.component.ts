import { Component, OnInit, ViewChild } from '@angular/core';
import { CategoryService } from '../category.service';
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
import { Config } from '../../configs/config';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css'],
})
export class AddCategoryComponent implements OnInit {
  title: string = '';
  description: string = '';
  parentCategory: any = null;
  categories: any = [];
  errorMessage: any = null;
  successMessage: any = null;
  constructor(private categService: CategoryService, private config: Config) {}

  ngOnInit() {
    this.getCategories();
  }

  onSubmit() {
    // if (!this.description || !this.title) return;

    const category = {
      titreCateg: this.title,
      descriptionCateg: this.description,
      categorie: this.parentCategory.id,
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
      next: (categories: Categorie[]) => {
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
  formatResult = (result: any) => result.titreCateg;
}
