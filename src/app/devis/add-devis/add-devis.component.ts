import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DevisService } from '../devis.service';
import { Subscription } from 'rxjs';
import { ProductService } from '../../produits/product.service';

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
  constructor(
    private fb: FormBuilder,
    private devisService: DevisService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchClients();
    this.devisForm = this.fb.group({
      idClient: [null, Validators.required],
      date: ['', Validators.required],
      valid_until: ['', Validators.required],
      tva: [0, Validators.required],
      items: this.fb.array([]),
    });
  }

  fetchClients() {
    this.devisService.getClients().subscribe((data) => (this.clients = data));
  }

  addItemByRef(ref: string): void {
    if (
      this.items.controls.some(
        (control) => control.get('produit')?.value.ref === ref
      )
    ) {
      this.showError(`Product with ref '${ref}' already added.`);
      return;
    }

    this.productService.getProductByRef(ref).subscribe(
      (product: any) => {
        if (product[0]) {
          const item = this.fb.group({
            produit: [product[0], Validators.required],
            produitDisplay: [product[0].titre],
            quantity: [0, Validators.required],
            warning: [''],
          });

          // Update warning based on initial quantity
          this.updateWarning(item);

          // Subscribe to changes in quantity to update warning dynamically
          item.get('quantity')?.valueChanges.subscribe(() => {
            this.updateWarning(item);
          });
          this.items.push(item);

          item.get('produitDisplay')?.disable();
        } else {
          this.showError(`Product with ref '${ref}' not found.`);
        }
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  get items(): FormArray {
    return this.devisForm.get('items') as FormArray;
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
}
