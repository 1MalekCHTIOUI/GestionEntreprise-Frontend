import { Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevisService } from '../devis.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  merge,
  Observable,
  of,
  OperatorFunction,
  Subject,
  Subscription,
  switchMap,
} from 'rxjs';
import { ProductService } from '../../produits/product.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { TaxesService } from '../../taxes/taxes.service';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-add-devis',
  templateUrl: './add-devis.component.html',
  styleUrls: ['./add-devis.component.css'],
})
export class AddDevisComponent {
  devisForm!: FormGroup;
  success: any;
  error: any;
  clients!: any[];
  taxes!: any[];
  products: any[] = [];
  selectedTax: any = null;
  searchQuery: string = '';

  constructor(
    private fb: FormBuilder,
    private devisService: DevisService,
    private productService: ProductService,
    private taxeService: TaxesService,
    private config: Config
  ) {}

  ngOnInit(): void {
    console.log(this.selectedTax);

    this.fetchClients();
    this.fetchProducts();
    this.fetchTaxes();
    this.devisForm = this.fb.group({
      idClient: [null, Validators.required],
      date: ['', Validators.required],

      items: this.fb.array([]),
      taxes: this.fb.array([]),
    });
  }

  fetchClients() {
    this.devisService
      .getClients()
      .subscribe((data: any) => (this.clients = data.clients));
  }

  fetchProducts() {
    this.productService
      .search('', this.config.AUTOCOMPLETE_INITIAL)
      .subscribe((data) => {
        console.log(data);

        this.products = data;
      });
  }

  fetchTaxes() {
    this.taxeService
      .search('', this.config.AUTOCOMPLETE_INITIAL)
      .subscribe((data: any) => (this.taxes = data));
  }

  addProduct(event: any): void {
    const product = event.item;

    if (
      this.items.controls.some(
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
        quantity: [0, Validators.required],
        warning: [''],
      });

      this.updateWarning(item);

      item.get('quantity')?.valueChanges.subscribe(() => {
        this.updateWarning(item);
      });
      this.items.push(item);

      item.get('produitDisplay')?.disable();
    } else {
      this.showError(`Product with ref '${product.ref}' not found.`);
    }
  }

  addTax(event: any): void {
    const tax = event.item;
    console.log(tax);

    if (
      this.taxItems.controls.some(
        (control) => control.get('tax')?.value.id === tax.id
      )
    ) {
      this.showError(`Product with ref '${tax.ref}' already added.`);
      return;
    }

    if (tax) {
      const item = this.fb.group({
        tax: [tax, Validators.required],
        taxDisplay: [tax.name],
        rate: [tax.rate, Validators.required],
      });

      this.taxItems.push(item);

      item.get('taxDisplay')?.disable();
      item.get('rate')?.disable();
    } else {
      this.showError(`Tax '${tax.name}' not found.`);
    }
  }

  removeItem(index: number, of: string): void {
    of === 'taxes' ? this.taxItems.removeAt(index) : this.items.removeAt(index);
  }

  get items(): FormArray {
    return this.devisForm.get('items') as FormArray;
  }

  get taxItems(): FormArray {
    return this.devisForm.get('taxes') as FormArray;
  }

  submitForm(): void {
    if (this.devisForm.valid) {
      console.log(this.devisForm.value);
      this.devisService.createDevis(this.devisForm.value).subscribe({
        next: () => {
          console.log('Devis créé avec succès');
          this.success = 'Devis créé avec succès';
          setTimeout(() => {
            this.success = '';
          }, 3000);
          this.devisForm.reset();
        },
        error: (error) => {
          console.error('Erreur lors de la création du devis', error);
          this.showError('Erreur lors de la création du devis');
        },
      });
    } else {
      console.log('fields');

      this.showError('Please fill all required fields');
    }
  }

  updateWarning(item: FormGroup): void {
    const quantity = item.get('quantity')?.value;
    const availableQuantity = item.get('produit')?.value.qte;

    if (quantity > availableQuantity) {
      item.patchValue({
        warning: `Quantity exceeds available stock by ${
          quantity - availableQuantity
        }.`,
      });
    } else {
      item.patchValue({
        warning: '',
      });
    }
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = '';
    }, 3000);
  }

  model: any;
  modelTax: any;

  @ViewChild('instanceP', { static: true }) instanceP!: NgbTypeahead;
  @ViewChild('instanceT', { static: true }) instanceT!: NgbTypeahead;

  focusP$ = new Subject<string>();
  clickP$ = new Subject<string>();
  focusT$ = new Subject<string>();
  clickT$ = new Subject<string>();
  loadingP: boolean = false;
  loadingT: boolean = false;
  searchProducts(term: string): Observable<any[]> {
    this.loadingP = true;

    if (term === '') {
      return this.productService
        .search('', this.config.AUTOCOMPLETE_INITIAL)
        .pipe(finalize(() => (this.loadingP = false)));
    } else {
      return this.productService
        .search(term, this.config.AUTOCOMPLETE_SEARCH_LIMIT)
        .pipe(finalize(() => (this.loadingP = false)));
    }
  }

  searchTaxes(term: string): Observable<any[]> {
    this.loadingT = true;
    if (term === '') {
      return this.taxeService
        .search('', this.config.AUTOCOMPLETE_INITIAL)
        .pipe(finalize(() => (this.loadingT = false)));
    } else {
      return this.taxeService
        .search(term, this.config.AUTOCOMPLETE_SEARCH_LIMIT)
        .pipe(finalize(() => (this.loadingT = false)));
    }
  }

  searchProd: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    console.log(this.products);

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

  searchTax: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) => {
    const debouncedText$ = text$.pipe(
      debounceTime(200),
      distinctUntilChanged()
    );
    const clicksWithClosedPopup$ = this.clickT$.pipe(
      filter(() => !this.instanceT.isPopupOpen())
    );
    const inputFocus$ = this.focusT$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      switchMap((term) => this.searchTaxes(term))
    );
  };

  formatResult = (result: any) => result.ref;
  formatResultTax = (result: any) => result.name;
}
