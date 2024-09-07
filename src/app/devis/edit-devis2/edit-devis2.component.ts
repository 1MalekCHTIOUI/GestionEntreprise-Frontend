import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
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
import { Client } from '../../models/client.model';
import { Produit } from '../../models/produit.model';
import { Devis } from '../../models/devis.model';
import { Tax } from '../../models/tax.model';
import { Parametre } from '../../models/parametre.model';

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
    this.fetchServices();
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

  fetchServices() {
    this.devisService.getDevisServices(this.devisId).subscribe((data) => {
      console.log(data);

      data.forEach((item: any) => {
        const serviceFormGroup = this.createServiceFormGroup();
        serviceFormGroup.patchValue({
          description: item.description,
          quantity: item.qte,
          cost: Number(item.cost),
        });
        this.services.push(serviceFormGroup);
      });
    });
  }

  fetchClients() {
    this.devisService.getClients().subscribe((data: any) => {
      this.clients = data.clients;
    });
  }

  findClient(id: number) {
    return this.clients?.find((client: Client) => client.id == id);
  }

  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
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

  PrixGrosOrVente(produit: Produit, qte: number) {
    return produit.qteMinGros < qte ? produit.prixGros : produit.prixVente;
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

    totalHT += this.getFraisLivraison();
    totalHT += this.totalServices();

    let totalTTC: number = totalHT;

    this.taxItems.controls.forEach((item: AbstractControl) => {
      const taxValue = item.get('tax')?.value;

      if (taxValue.rate) {
        totalTTC += totalHT * (taxValue.rate / 100);
      } else if (taxValue.name == 'Droit Timbre') {
        totalTTC += Number(this.parameters.timbre_fiscale);
      }
    });

    return { totalHT, totalTTC };
  }

  productsWithPromo(): any[] {
    return (this.items.value as any[]).filter(
      (product: any) => product.produit.promo
    );
  }

  calculateTotalProd(
    promo: boolean,
    produit: Produit,
    quantity: number
  ): number {
    let total: number = quantity * this.PrixGrosOrVente(produit, quantity);
    if (promo && produit.promo) {
      total -= total * (Number(produit.promo) / 100);
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
          totalHT: devis.totalHT,
          totalServices: devis.totalServices,
          totalRemises: devis.totalRemises,
          totalFraisLivraison: devis.totalFraisLivraison,

          totalTTC: devis.totalTTC,
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
      .subscribe((data: Tax[]) => (this.taxes = data));
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

  addService(): void {
    this.services.push(this.createServiceFormGroup());
  }

  removeService(index: number): void {
    this.services.removeAt(index);
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

  getFraisLivraison(): number {
    let fraisTotal = 0;
    this.items.controls.forEach((item: any) => {
      fraisTotal += item.value.produit.fraisTransport * item.value.quantity;
    });
    return fraisTotal;
  }

  totalServices(): number {
    let total = 0;
    this.services.controls.forEach((item: any) => {
      total += Number(item.value.cost * item.value.quantity);
    });
    return total;
  }

  calculateValue(number: number, rate: number): number {
    const rateInDecimal = rate / 100;
    return number * rateInDecimal;
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

      const totalHT = Number(
        this.calculateTotal(false).totalHT -
          this.getFraisLivraison() -
          this.totalServices()
      );

      const totalAvecServicesRemisesTaxes = Number(
        this.calculateTotal(true).totalTTC
      );

      console.log({
        totalHT: totalHT,
        totalTTC: totalAvecServicesRemisesTaxes,
        totalServices: this.totalServices(),
        totalRemises: this.totalRemises(),
        totalFraisLivraison: this.getFraisLivraison(),
      });

      this.devisForm.patchValue({
        totalHT: totalHT,
        totalTTC: totalAvecServicesRemisesTaxes,
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

      this.devisService
        .updateDevis(this.devisId, this.devisForm.value)
        .subscribe({
          next: (data) => {
            console.log(data);

            // setTimeout(() => {
            //   this.router.navigate(['/devis']);
            // }, 2000);
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
