import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromotionService } from '../promotion.service';
import { ProductService } from '../../produits/product.service';
import {
  NgbTypeahead,
  NgbTypeaheadSelectItemEvent,
} from '@ng-bootstrap/ng-bootstrap';
import {
  Subject,
  Observable,
  merge,
  debounceTime,
  distinctUntilChanged,
  map,
  OperatorFunction,
  filter,
  finalize,
  switchMap,
} from 'rxjs';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-form-promotions',
  templateUrl: './form-promotions.component.html',
  styleUrl: './form-promotions.component.css',
})
export class FormPromotionsComponent {
  promotionForm!: FormGroup;
  success: any;
  error: any;
  products: any[] = [];
  searchQuery: string = '';
  isEditMode: boolean = false;
  promotionId!: number;
  imageFooterFile: any = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private promotionService: PromotionService,
    private route: ActivatedRoute,
    private router: Router,
    private config: Config
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.promotionForm = this.fb.group({
      description: ['', Validators.required],
      // image_footer: ['', Validators.required],
      promo: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      produits: this.fb.array([]),
    });

    // Check if this is an edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.promotionId = +params['id'];
        this.loadPromotion(this.promotionId);
      }
    });
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.imageFooterFile = file;
    }
  }

  fetchProducts() {
    this.productService
      .search('', this.config.AUTOCOMPLETE_INITIAL)
      .subscribe((data) => {
        console.log(data);

        this.products = data;
      });
  }

  promotion: any = {};

  loadPromotion(id: number) {
    this.promotionService.getPromotionById(id).subscribe((promotion) => {
      console.log(promotion);

      this.imageFooterFile = promotion.image_footer;

      this.promotionForm.patchValue({
        description: promotion.description,
        promo: promotion.promo,
      });
      this.setProducts(promotion.produits);
    });
  }

  setProducts(produits: any[]) {
    const produitsFormArray = this.produits;
    produits.forEach((produit) => {
      produitsFormArray.push(
        this.fb.group({
          produit: [produit, Validators.required],
          produitDisplay: [produit.titre],
        })
      );
    });
  }

  addItemByRef(event: any): void {
    const product = event.item;

    if (
      this.produits.controls.some(
        (control) => control.get('produit')?.value.ref === product.ref
      )
    ) {
      this.showError(`Product with ref '${product.ref}' already added.`);
      return;
    }

    if (product) {
      const item = this.fb.group({
        produit: [product, Validators.required],
        produitDisplay: [product.titre],
      });

      this.produits.push(item);
      item.get('produitDisplay')?.disable();
    } else {
      this.showError(`Product with ref '${product.ref}' not found.`);
    }
  }

  removeItem(index: number): void {
    this.produits.removeAt(index);
  }

  get produits(): FormArray {
    return this.promotionForm.get('produits') as FormArray;
  }

  submitForm(): void {
    if (this.promotionForm.valid) {
      const produits = this.promotionForm.value.produits.map(
        (p: any) => p.produit.id
      );

      const updateObject: any = {
        description: this.promotionForm.get('description')?.value,
        promo: this.promotionForm.get('promo')?.value,
        produits: produits,
      };

      if (this.isEditMode) {
        console.log(this.promotionForm.value);
        if (this.imageFooterFile instanceof (Blob || File)) {
          updateObject['image_footer'] = this.imageFooterFile;
        }
        console.log(updateObject);

        this.promotionService
          .updatePromotion(this.promotionId, updateObject)
          .subscribe({
            next: () => {
              this.success = 'Promotion updated successfully';
              setTimeout(() => (this.success = ''), 3000);
              this.router.navigate(['/promotions']);
            },
            error: (error) => {
              console.error('Error updating promotion', error);
              this.showError('Error updating promotion');
            },
          });
      } else {
        console.log(this.promotionForm.value);
        this.promotionService.addPromotion(updateObject).subscribe({
          next: () => {
            this.success = 'Promotion created successfully';
            setTimeout(() => (this.success = ''), 3000);
            this.promotionForm.reset();
            this.router.navigate(['/promotions']);
          },
          error: (error) => {
            console.error('Error creating promotion', error);
            this.showError('Error creating promotion');
          },
        });
      }
    } else {
      this.showError('Please fill all required fields');
    }
  }
  returnImg(image: any) {
    if (typeof image === 'string') {
      return this.config.getPhotoPath('promotions') + image;
    } else if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else {
      return null;
    }
  }
  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = '';
    }, 3000);
  }

  model: any;

  @ViewChild('instanceP', { static: true }) instanceP!: NgbTypeahead;

  focusP$ = new Subject<string>();
  clickP$ = new Subject<string>();
  loading: boolean = false;

  searchProducts(term: string): Observable<any[]> {
    this.loading = true;

    if (term === '') {
      return this.productService
        .search('', this.config.AUTOCOMPLETE_INITIAL)
        .pipe(finalize(() => (this.loading = false)));
    } else {
      return this.productService
        .search(term, this.config.AUTOCOMPLETE_SEARCH_LIMIT)
        .pipe(finalize(() => (this.loading = false)));
    }
  }

  searchProd: OperatorFunction<string, readonly any[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.clickP$.pipe(
      filter(() => !this.instanceP.isPopupOpen())
    );
    const inputFocus$ = this.focusP$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      switchMap((term) => this.searchProducts(term))
    );
  };

  formatResult = (result: any) => result.ref;
}
