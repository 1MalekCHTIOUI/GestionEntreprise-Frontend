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
import { Client } from '../../models/client.model';
import { Produit } from '../../models/produit.model';
import { Parametre } from '../../models/parametre.model';
import { Tax } from '../../models/tax.model';

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
      totalHT: [0],
      totalServices: [0],
      totalRemises: [0],
      totalFraisLivraison: [0],

      totalTTC: [0],
      items: this.fb.array([]),
      taxes: this.fb.array([]),
      services: this.fb.array([]),

      model: [null],
      modelTax: [null],
    });

    this.getParams();
    console.log(this.parameters);
  }

  get services(): FormArray {
    return this.devisForm.get('services') as FormArray;
  }

  createServiceFormGroup(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      cost: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addService(): void {
    this.services.push(this.createServiceFormGroup());
  }

  removeService(index: number): void {
    this.services.removeAt(index);
  }

  initDefaultTaxes(data: any) {
    let tva = {
      id: 'x',
      name: 'TVA',
      rate: data.tva,
    };
    let timbre = {
      id: 'y',
      name: 'Droit Timbre',
      value: data.timbre_fiscale,
    };
    let fodec = {
      id: 'z',
      name: 'Fodec',
      rate: data.fodec,
    };

    this.taxItems.push(
      this.fb.group({
        tax: [tva],
        taxDisplay: [tva.name],
        rate: [tva.rate],
      })
    );
    this.taxItems.push(
      this.fb.group({
        tax: [timbre],
        taxDisplay: [timbre.name],
        rate: [],
      })
    );
    this.taxItems.push(
      this.fb.group({
        tax: [fodec],
        taxDisplay: [fodec.name],
        rate: [fodec.rate],
      })
    );
  }

  fetchClients() {
    this.devisService.getClients().subscribe((data: any) => {
      console.log(data);
      this.clients = data.clients;
    });
  }

  findClient(id: number) {
    return this.clients.find((client: Client) => client.id == id);
  }

  calculateValue(number: number, rate: number): number {
    const rateInDecimal = rate / 100;
    return number * rateInDecimal;
  }

  fetchProducts() {
    this.productService
      .search('', this.config.AUTOCOMPLETE_INITIAL)
      .subscribe((data: Produit[]) => {
        console.log(data);

        this.products = data;
      });
  }
  PrixGrosOrVente(produit: Produit, qte: number) {
    return produit.qteMinGros < qte ? produit.prixGros : produit.prixVente;
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
        this.initDefaultTaxes(data);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  productsWithPromo(): any[] {
    return (this.items.value as any[]).filter(
      (product: any) => product.produit.promo
    );
  }

  calculateTotal(promo: boolean = false) {
    let totalHT = 0;
    this.items.controls.forEach((produit: AbstractControl) => {
      totalHT += this.calculateTotalProd(
        promo ? true : false,
        produit.get('produit')?.value,
        produit.get('quantity')?.value
      );
    });

    totalHT += this.totalServices();

    totalHT += this.getFraisLivraison();

    let totalTTC: number = totalHT;

    this.taxItems.controls.forEach((item: AbstractControl) => {
      const taxValue: Tax = item.get('tax')?.value;
      if (taxValue.rate) {
        totalTTC += totalHT * (taxValue.rate / 100);
      } else if (taxValue.name == 'Droit Timbre') {
        totalTTC += Number(this.parameters.timbre_fiscale);
      }
    });
    return { totalHT, totalTTC };
  }

  calculateTotalProd(
    promo: boolean,
    produit: Produit,
    quantity: number
  ): number {
    let total = quantity * this.PrixGrosOrVente(produit, quantity);
    if (promo && produit.promo) {
      total -= total * (Number(produit.promo) / 100);
    }
    return total;
  }

  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
  }

  addProduct(event: any): void {
    const product: Produit = event.item;
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
      this.showError(`Product with ref '${event.item.ref}' not found.`);
    }
  }

  addTax(event: any): void {
    const tax: Tax = event.item;
    if (
      this.taxItems.controls.some(
        (control) => control.get('tax')?.value.id === tax.id
      )
    ) {
      this.showError(`Tax with name '${tax.name}' already added.`);
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
      this.showError(`Tax '${event.item.name}' not found.`);
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

  totalRemises(): number {
    let total: number = 0;
    this.items.controls.forEach((item: any) => {
      total += +this.calculateValue(
        this.calculateTotalProd(false, item.value.produit, item.value.quantity),
        item.value.produit.promo
      ).toFixed(2);
    });
    return total;
  }

  totalServices(): number {
    let total = 0;
    this.services.controls.forEach((item: any) => {
      total += Number(item.value.cost * item.value.quantity);
    });
    return total;
  }

  getFraisLivraison(): number {
    let fraisTotal = 0;
    this.items.controls.forEach((item: any) => {
      fraisTotal += item.value.produit.fraisTransport * item.value.quantity;
    });
    return fraisTotal;
  }

  submitForm(): void {
    if (this.devisForm.valid) {
      const totalHT = Number(
        this.calculateTotal(false).totalHT -
          this.getFraisLivraison() -
          this.totalServices()
      );

      this.devisForm.patchValue({
        totalHT: totalHT,
        totalTTC: Number(this.calculateTotal(true).totalTTC),
        totalServices: this.totalServices(),
        totalRemises: this.totalRemises(),
        totalFraisLivraison: this.getFraisLivraison(),
      });

      const devis = this.devisForm.value;
      const excludedKeys = ['TVA', 'Fodec', 'Droit Timbre'];

      const taxes = devis.taxes.filter((tax: any) => {
        return !excludedKeys.includes(tax.tax.name);
      });

      devis.taxes = taxes;

      console.log(devis);

      this.devisService.createDevis(this.devisForm.value).subscribe({
        next: () => {
          console.log('Devis créé avec succès');
          this.success = 'Devis créé avec succès';
          setTimeout(() => {
            this.success = '';
          }, 3000);
          // this.router.navigateByUrl('/devis');
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

  model!: any;
  modelTax!: any;

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
