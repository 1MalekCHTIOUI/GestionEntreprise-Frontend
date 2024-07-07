import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DevisService } from '../devis.service';
import { ProductService } from '../../produits/product.service';

@Component({
  selector: 'app-edit-devis',
  templateUrl: './edit-devis.component.html',
  styleUrls: ['./edit-devis.component.css'],
})
export class EditDevisComponent implements OnInit {
  devisForm!: FormGroup;
  success: any;
  clients!: any[];
  error: any;
  devisId!: number;

  constructor(
    private fb: FormBuilder,
    private devisService: DevisService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.devisId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadDevis();
    this.fetchClients();
  }

  initForm(): void {
    this.devisForm = this.fb.group({
      idClient: ['', Validators.required],
      date: ['', Validators.required],
      valid_until: ['', Validators.required],
      tva: [0, Validators.required],
      items: this.fb.array([]),
    });
  }
  fetchClients() {
    this.devisService.getClients().subscribe((data) => {
      this.clients = data;
    });
  }
  loadDevis(): void {
    this.devisService.getDevisById(this.devisId).subscribe(
      (devis: any) => {
        console.log(devis.client_id);

        this.devisForm.patchValue({
          idClient: devis.client_id,
          date: devis.date,
          valid_until: devis.valid_until,
          tva: devis.tva,
        });
        this.setItems(devis.produits);
      },
      (error) => {
        console.error('Error fetching devis:', error);
      }
    );
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

          this.updateWarning(item);
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
      this.devisService
        .updateDevis(this.devisId, this.devisForm.value)
        .subscribe(
          () => {
            console.log('Devis updated successfully');
            this.router.navigate(['/devis']);
          },
          (error) => {
            console.error('Error updating devis', error);
          }
        );
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
}
