import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProductService } from '../product.service';
import { CategoryService } from '../../categories/category.service';
import { AccessoireService } from '../../accessoires/accessoire.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  public Editor = ClassicEditor;
  productForm!: FormGroup;
  accessoireForm!: FormGroup;
  message!: string;
  isSuccess!: boolean;
  categories: any[] = []; // Fetch this from your API
  accessoires: any[] = []; // Fetch this from your API
  addedAccessoires: any[] = [];
  selectedImages: any[] = [];
  formFields = [
    {
      id: 'titre',
      name: 'titre',
      label: 'Titre',
      type: 'text',
      placeholder: 'Entrer Titre',
    },
    {
      id: 'ref',
      name: 'ref',
      label: 'Référence',
      type: 'text',
      placeholder: 'Entrer la référence',
    },
    {
      id: 'couleur',
      name: 'couleur',
      label: 'Couleur',
      type: 'text',
      placeholder: 'Entrer la couleur',
    },
    {
      id: 'prixCharge',
      name: 'prixCharge',
      label: 'Prix de charge',
      type: 'number',
      placeholder: 'Entrer le prix de charge',
    },
    {
      id: 'prixVente',
      name: 'prixVente',
      label: 'Prix de vente',
      type: 'number',
      placeholder: 'Entrer le prix de vente',
    },
    {
      id: 'qte',
      name: 'qte',
      label: 'Quantité',
      type: 'number',
      placeholder: 'Entrer la quantité',
    },
    {
      id: 'qteMinGros',
      name: 'qteMinGros',
      label: 'Quantité minimum pour gros',
      type: 'number',
      placeholder: 'Entrer la quantité minimum pour gros',
    },
    {
      id: 'prixGros',
      name: 'prixGros',
      label: 'Prix de gros',
      type: 'number',
      placeholder: 'Entrer le prix de gros',
    },
    {
      id: 'promo',
      name: 'promo',
      label: 'Promotion',
      type: 'number',
      placeholder: 'Entrer la promotion',
    },
    {
      id: 'longueur',
      name: 'longueur',
      label: 'Longueur',
      type: 'number',
      placeholder: 'Entrer la longueur',
    },
    {
      id: 'largeur',
      name: 'largeur',
      label: 'Largeur',
      type: 'number',
      placeholder: 'Entrer la largeur',
    },
    {
      id: 'hauteur',
      name: 'hauteur',
      label: 'Hauteur',
      type: 'number',
      placeholder: 'Entrer la hauteur',
    },
    {
      id: 'profondeur',
      name: 'profondeur',
      label: 'Profondeur',
      type: 'number',
      placeholder: 'Entrer la profondeur',
    },
  ];
  extraFields = [
    {
      id: 'tempsProduction',
      name: 'tempsProduction',
      label: 'Temps de production',
      type: 'number',
      placeholder: 'Entrer le temps de production(H)',
    },
    {
      id: 'matiers',
      name: 'matiers',
      label: 'Matériaux',
      type: 'text',
      placeholder: 'Entrer les matériaux',
    },
    {
      id: 'fraisTransport',
      name: 'fraisTransport',
      label: 'Frais de transport',
      type: 'number',
      placeholder: 'Entrer les frais de transport',
    },
  ];
  // addedAccessoiresFormArray!: FormArray;
  constructor(
    private fb: FormBuilder,
    private prodService: ProductService,
    private categService: CategoryService,
    private accService: AccessoireService,
    private route: Router
  ) {}
  ngOnInit(): void {
    this.productForm = this.fb.group({
      titre: ['', Validators.required],
      ref: ['', Validators.required],
      couleur: ['', Validators.required],
      prixCharge: ['', Validators.required],
      prixVente: ['', Validators.required],
      qte: ['', Validators.required],
      qteMinGros: ['', Validators.required],
      prixGros: ['', Validators.required],
      promo: [''],
      longueur: [''],
      largeur: [''],
      hauteur: [''],
      profondeur: [''],
      tempsProduction: [''],
      matiers: [''],
      description: [''],
      descriptionTechnique: [''],
      ficheTechnique: [''],
      publicationSocial: [''],
      fraisTransport: [''],
      idCategorie: ['', Validators.required],
      imagePrincipale: [''],
      active: [''],
      accessoires: [''],
      cuts: this.fb.array([]),
    });
    this.getCategories();
    this.getAccessoires();

    // this.addedAccessoiresFormArray = this.fb.array([]);
    this.accessoireForm = this.fb.group({
      addedAccessoires: this.fb.array([]), // FormArray for accessories
    });
  }
  get cuts(): FormArray {
    return this.productForm.get('cuts') as FormArray;
  }

  addCut(event: any): void {
    event.preventDefault();
    this.cuts.push(
      this.fb.group({
        largeur: [0, [Validators.required, Validators.min(0)]],
        longueur: [0, [Validators.required, Validators.min(0)]],
        epaisseur: [0, [Validators.required, Validators.min(0)]],
        perimetre: [0],
      })
    );
  }

  removeCut(index: number): void {
    this.cuts.removeAt(index);
  }

  calculatePerimetre(cut: AbstractControl): number {
    const width = cut.get('largeur')?.value || 0;
    const height = cut.get('longueur')?.value || 0;

    if (width === 0 || height === 0) return 0;

    this.cuts.controls
      .find((c) => c === cut)
      ?.get('perimetre')
      ?.setValue(2 * (width + height));
    return 2 * (width + height);
  }

  get addedAccessoiresFormArray(): FormArray {
    return this.accessoireForm.get('addedAccessoires') as FormArray;
  }
  getCategories() {
    this.categService.getCategories().subscribe((response: any) => {
      this.categories = response;
    });
  }

  getAccessoires() {
    this.accService.getAccessoires().subscribe((response: any) => {
      this.accessoires = response;
    });
  }

  onSubmit(): void {
    console.log('test');

    if (this.productForm.invalid) {
      console.log('INVALID');
    }

    const formData = new FormData();
    Object.keys(this.productForm.value).forEach((key) => {
      if (key === 'ficheTechnique' || key === 'imagePrincipale') {
        formData.append(key, this.productForm.value[key]);
      } else {
        formData.append(key, this.productForm.value[key]);
      }
    });

    this.selectedImages.forEach((file) => {
      formData.append('images[]', file);
    });

    const accessoires = this.addedAccessoiresFormArray.controls.map(
      (control) => ({
        idAccessoire: control.get('idAccessoire')?.value,
        qte: control.get('qte')?.value,
      })
    );
    console.log(accessoires);

    formData.append('accessoires', JSON.stringify(accessoires));

    if (this.cuts.length > 0) {
      console.log(this.cuts.value);

      formData.append('cuts', JSON.stringify(this.cuts.value));
    }

    this.prodService.addProduct(formData).subscribe({
      next: (response: any) => {
        console.log(response);

        this.message = response.message;
        this.isSuccess = true;
        // this.route.navigate(['/products']);
        // this.productForm.reset();
        // this.selectedImages = [];
        // this.addedAccessoires = [];
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
      error: (error) => {
        console.log(error);

        this.message = error.error.message;
        this.isSuccess = false;
        setTimeout(() => {
          this.message = '';
        }, 3000);
      },
    });
  }

  onFileChange(event: Event, controlName: string): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const file = inputElement.files[0];
      this.productForm.patchValue({
        [controlName]: file,
      });
    }
  }
  getImgUrl(file: File): string {
    return URL.createObjectURL(file);
  }
  onImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedImages.push(files[i]);
      }
    }
  }

  removeImage(image: string): void {
    this.selectedImages = this.selectedImages.filter((img) => img !== image);
  }

  addAccessoire(event: Event): void {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    if (selectedIndex === 0) return; // Assuming the first option is default selection

    const acc = this.accessoires[selectedIndex - 1]; // Adjust index

    if (this.addedAccessoires.find((a) => a.id === acc.id)) {
      return; // Prevent adding duplicates
    }

    this.addedAccessoires.push(acc);

    const formGroup = this.fb.group({
      idAccessoire: [acc.id],
      qte: [0], // Initialize quantity with 0 or appropriate default
    });

    this.addedAccessoiresFormArray.push(formGroup);
  }

  removeAccessoire(index: number): void {
    this.addedAccessoires.splice(index, 1); // Remove from display array
    this.addedAccessoiresFormArray.removeAt(index); // Remove from form array
  }

  hasRequiredValidator(controlName: string): boolean {
    const control: AbstractControl | null = this.productForm.get(controlName);
    if (control) {
      const validator = control.validator
        ? control.validator({} as AbstractControl)
        : null;
      return validator && validator['required'];
    }
    return false;
  }
}
