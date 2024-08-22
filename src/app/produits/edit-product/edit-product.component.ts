import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../categories/category.service';
import { AccessoireService } from '../../accessoires/accessoire.service';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent {
  public Editor = ClassicEditor;
  productForm!: FormGroup;
  message!: string;
  isSuccess!: boolean;
  categories: any[] = [];
  accessoires: any[] = [];
  addedAccessoires: any[] = [];
  selectedImages: any[] = [];
  existingImages: any[] = [];
  product: any;
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

  constructor(
    private fb: FormBuilder,
    private prodService: ProductService,
    private categService: CategoryService,
    private accService: AccessoireService,
    private route: ActivatedRoute,
    private config: Config
  ) {}
  id: any = null;
  allImages: any = [];
  ngOnInit(): void {
    this.productForm = this.fb.group({
      titre: ['', Validators.required],
      ref: ['', Validators.required],
      prixCharge: ['', Validators.required],
      prixVente: ['', Validators.required],
      qte: ['', Validators.required],
      qteMinGros: ['', Validators.required],
      prixGros: ['', Validators.required],
      promo: ['', Validators.required],
      longueur: ['', Validators.required],
      largeur: ['', Validators.required],
      hauteur: ['', Validators.required],
      profondeur: ['', Validators.required],
      tempsProduction: ['', Validators.required],
      matiers: ['', Validators.required],
      description: ['', Validators.required],
      descriptionTechnique: ['', Validators.required],
      ficheTechnique: [''],
      publicationSocial: ['', Validators.required],
      fraisTransport: ['', Validators.required],
      idCategorie: ['', Validators.required],
      imagePrincipale: [''],
      active: ['', Validators.required],
      accessoires: [''],
    });
    this.getCategories();
    this.getAccessoires();
    this.accessoireForm = this.fb.group({
      addedAccessoires: this.fb.array([]), // FormArray for accessories
    });

    this.route.params.subscribe((params) => {
      this.prodService.getProduct(params['id']).subscribe((response: any) => {
        this.id = params['id'];
        this.product = response[0];

        this.addedAccessoires = response[0].accessoires;
        // Fill the accessoires in the form array
        response[0].accessoires.forEach((acc: any) => {
          const formGroup = this.fb.group({
            idAccessoire: [acc.id],
            qte: [acc.pivot.qte],
          });
          this.addedAccessoiresFormArray.push(formGroup);
        });
        console.log(response[0].accessoires);

        this.productForm.patchValue({
          titre: this.product.titre,
          ref: this.product.ref,
          prixCharge: this.product.prixCharge,
          prixVente: this.product.prixVente,
          qte: this.product.qte,
          qteMinGros: this.product.qteMinGros,
          prixGros: this.product.prixGros,
          promo: this.product.promo,
          longueur: this.product.longueur,
          largeur: this.product.largeur,
          hauteur: this.product.hauteur,
          profondeur: this.product.profondeur,
          tempsProduction: this.product.tempsProduction,
          matiers: this.product.matiers,
          description: this.product.description,
          descriptionTechnique: this.product.descriptionTechnique,
          ficheTechnique: this.product.ficheTechnique,
          publicationSocial: this.product.publicationSocial,
          fraisTransport: this.product.fraisTransport,
          idCategorie: this.product.idCategorie,
          imagePrincipale: this.product.imagePrincipale,
          active: this.product.active,
          accessoires: this.product.accessoires,
        });
        console.log(this.productForm.value);
        console.log(this.product.images);

        this.product.images.forEach((element: any) => {
          this.existingImages.push(element.id);
        });

        console.log(this.existingImages);
      });
    });
  }
  accessoireForm!: FormGroup;
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

  returnImage(img: string) {
    return `${this.config.getPhotoPath('produits')}${img}`;
  }

  returnImageObject(img: File) {
    return URL.createObjectURL(img);
  }

  returnImg(image: any) {
    if (typeof image === 'string') {
      return this.config.getPhotoPath('produits') + image;
    } else if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else {
      return null;
    }
  }

  onSubmit(): void {
    // if (this.productForm.invalid) {
    //   return;
    // }
    const formData = new FormData();

    this.formFields.forEach((field) => {
      formData.append(field.name, this.productForm.value[field.name]);
    });
    this.extraFields.forEach((f) => {
      formData.append(f.name, this.productForm.value[f.name]);
    });

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

    this.existingImages.forEach((file) => {
      formData.append('existing_images[]', file);
    });

    const accessoires = this.addedAccessoiresFormArray.controls.map(
      (control) => ({
        idAccessoire: control.get('idAccessoire')?.value,
        qte: control.get('qte')?.value,
      })
    );
    console.log(accessoires);

    formData.append('accessoires', JSON.stringify(accessoires));

    // for (let pair of (formData as any).entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);

    this.prodService.updateProduct(this.id, formData).subscribe({
      next: (response: any) => {
        this.message = response.message;
        this.isSuccess = true;
        this.productForm.reset();
        this.selectedImages = [];
        this.addedAccessoires = [];
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
  @ViewChild('imagesList') imagesList!: ElementRef;

  getImgUrl(file: any) {
    return URL.createObjectURL(file);
  }
  onImagesChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.selectedImages.push(files[i]);
      }
    }

    console.log(this.selectedImages);
  }

  removeImage(image: string): void {
    this.selectedImages = this.selectedImages.filter((img) => img !== image);
  }
  removeImageEx(image: any): void {
    this.existingImages = this.existingImages.filter((img) => img !== image.id);
    this.product.images = this.product.images.filter(
      (img: any) => img.id !== image.id
    );
  }

  addAccessoire(event: Event): void {
    const selectedIndex = (event.target as HTMLSelectElement).selectedIndex;
    if (selectedIndex === 0) return;

    const acc = this.accessoires[selectedIndex - 1];

    if (this.addedAccessoires.find((a) => a.id === acc.id)) {
      return;
    }

    this.addedAccessoires.push(acc);

    const formGroup = this.fb.group({
      idAccessoire: [acc.id],
      qte: [0],
    });

    this.addedAccessoiresFormArray.push(formGroup);
  }

  removeAccessoire(index: number): void {
    this.addedAccessoires.splice(index, 1);
    this.addedAccessoiresFormArray.removeAt(index);
  }
}
