import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { Config } from '../../configs/config';
import { ProductService } from '../../produits/product.service';
import { TaxesService } from '../../taxes/taxes.service';
import { DevisService } from '../devis.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-devis2',
  templateUrl: './edit-devis2.component.html',
  styleUrl: './edit-devis2.component.css',
})
export class EditDevis2Component {
  devisForm!: FormGroup;
  parameters: any;

  success: any;
  clients!: any[];
  products!: any[];
  taxes!: any[];
  error: any;
  devisId!: number;
  selectedTax: any = null;
  searchQuery: string = '';
  constructor(
    private fb: FormBuilder,
    private devisService: DevisService,
    private productService: ProductService,
    private taxeService: TaxesService,
    private route: ActivatedRoute,
    private router: Router,
    private config: Config,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.devisId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadDevis();
    this.fetchClients();
    this.fetchProducts();
    this.getParams();
  }

  fetchProducts() {
    this.productService
      .search('', this.config.AUTOCOMPLETE_INITIAL)
      .subscribe((data) => {
        console.log(data);

        this.products = data;
      });
  }

  initForm(): void {
    this.devisForm = this.fb.group({
      idClient: ['', Validators.required],
      date: ['', Validators.required],
      items: this.fb.array([]),
      taxes: this.fb.array([]),
    });
  }

  fetchClients() {
    this.devisService.getClients().subscribe((data) => {
      this.clients = data.clients;
    });
  }
  findClient(id: number) {
    return this.clients.find((client) => client.id == id);
  }
  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
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
  loadDevis(): void {
    this.devisService.getDevisById(this.devisId).subscribe(
      (devis: any) => {
        console.log(devis.client_id);

        this.devisForm.patchValue({
          idClient: devis.client_id,
          date: devis.date,
        });
        this.setItems(devis.produits);
        this.setTaxItems(devis.taxes);
      },
      (error) => {
        console.error('Error fetching devis:', error);
      }
    );
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

  setItems(items: any[]): void {
    console.log(items);

    const itemsFormArray = this.devisForm.get('items') as FormArray;
    items.forEach((item) => {
      const itemGroup = this.fb.group({
        produit: [item, Validators.required],
        produitDisplay: [item.titre],
        quantity: [item.pivot.qte, Validators.required],
        warning: [''],
      });
      this.updateWarning(itemGroup);
      itemGroup.get('quantity')?.valueChanges.subscribe(() => {
        this.updateWarning(itemGroup);
      });
      itemGroup.get('produitDisplay')?.disable();
      itemsFormArray.push(itemGroup);
    });
  }

  setTaxItems(items: any[]): void {
    console.log(items);

    const itemsFormArray = this.devisForm.get('taxes') as FormArray;
    items.forEach((item) => {
      const itemGroup = this.fb.group({
        tax: [item, Validators.required],
        taxDisplay: [item.name],
        rate: [item.rate, Validators.required],
      });

      itemGroup.get('taxDisplay')?.disable();
      itemsFormArray.push(itemGroup);
    });
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
      this.devisService
        .updateDevis(this.devisId, this.devisForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);

            setTimeout(() => {
              this.router.navigate(['/devis']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error updating devis:', error);
            this.showError('Error updating devis');
          },
        });
    } else {
      this.showError('Please fill all required fields');
    }
  }

  showError(message: string) {
    this.error = message;
    setTimeout(() => {
      this.error = '';
    }, 3000);
  }

  updateWarning(item: FormGroup): void {
    const quantity = item.get('quantity')?.value;
    const availableQuantity = item.get('produit')?.value.qte;

    if (quantity > availableQuantity) {
      item.patchValue({
        warning: `Quantity exceeds available stock (${availableQuantity}).`,
      });
    } else {
      item.patchValue({
        warning: '',
      });
    }
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

  updateDevisStatus() {
    this.devisService
      .updateStatus(this.devisId, 'refused')
      .subscribe((data) => {
        this.router.navigate(['/devis']);
      });
  }
}
