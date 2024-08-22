import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Config } from '../../configs/config';
import { DevisService } from '../devis.service';
import { ProductService } from '../../produits/product.service';
import { TaxesService } from '../../taxes/taxes.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import {
  Subject,
  Observable,
  finalize,
  OperatorFunction,
  debounceTime,
  distinctUntilChanged,
  filter,
  merge,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-add-devis2',
  templateUrl: './add-devis2.component.html',
  styleUrl: './add-devis2.component.css',
})
export class AddDevis2Component {
  devis: any = null;
  date!: Date;
  parameters: any;

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
    private router: Router,
    private config: Config,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchClients();
    this.fetchProducts();
    this.fetchTaxes();
    this.devisForm = this.fb.group({
      idClient: [null, Validators.required],
      date: ['', Validators.required],

      items: this.fb.array([]),
      taxes: this.fb.array([]),
    });
    this.getParams();
  }
  fetchClients() {
    this.devisService.getClients().subscribe((data) => {
      console.log(data);
      this.clients = data.clients;
    });
  }

  findClient(id: number) {
    return this.clients.find((client) => client.id == id);
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

  getParams() {
    this.http.get(`${this.config.getAPIPath()}/parameters/1`).subscribe({
      next: (data: any) => {
        console.log(data);

        this.parameters = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  calculateTotalAvecPromoTaxe() {
    let totalHT = 0;

    // this.devis.produits.forEach((produit: any) => {
    //   totalHT += this.calculateTotalAvecPromoSansTaxe(
    //     produit,
    //     produit.pivot.qte
    //   );
    // });
    this.items.controls.forEach((produit: any) => {
      totalHT += this.calculateTotalAvecPromoSansTaxe(
        produit.get('produit').value,
        produit.get('quantity').value
      );
    });
    let totalTTC = totalHT;
    this.taxItems.controls.forEach((tax: any) => {
      totalTTC += totalHT * (tax.get('tax').value.rate / 100);
    });
    return { totalHT, totalTTC };
  }

  checkIfOneProdHasQuantity() {
    let result = false;
    this.items.controls.forEach((produit: any) => {
      if (produit.get('quantity').value > 0) {
        result = true;
      }
    });
    return result;
  }

  calculateTotalAvecPromoSansTaxe(produit: any, quantity: number): number {
    let total =
      quantity >= produit.qteMinGros
        ? quantity * produit.prixGros
        : quantity * produit.prixVente;
    if (produit.promo) {
      total -= total * (produit.promo / 100);
    }
    return total;
  }

  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
  }

  addProduct(event: any): void {
    const product = event.item;
    console.log(product);

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
      console.log(this.items);
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
      console.log(this.taxItems);

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
          this.router.navigateByUrl('/devis');
        },
        error: (error) => {
          console.error('Erreur lors de la création du devis', error);
          this.showError('Erreur lors de la création du devis');
        },
      });
    } else {
      console.log(this.devisForm.errors);
      this.logInvalidFields();

      this.showError('Please fill all required fields');
    }
  }
  logInvalidFields() {
    Object.keys(this.devisForm.controls).forEach((key) => {
      const control = this.devisForm.get(key);
      if (control instanceof FormArray) {
        (control as FormArray).controls.forEach(
          (group: AbstractControl<any>, index: number) => {
            Object.keys((group as FormGroup).controls).forEach((subKey) => {
              const subControl = (group as FormGroup).get(subKey);
              if (subControl && subControl.invalid) {
                console.log(`Invalid field: items[${index}].${subKey}`);
              }
            });
          }
        );
      } else if (control && control.invalid) {
        console.log(`Invalid field: ${key}`);
      }
    });
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
