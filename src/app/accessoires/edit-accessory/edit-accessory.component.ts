import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccessoireService } from '../accessoire.service';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-edit-accessory',
  templateUrl: './edit-accessory.component.html',
  styleUrls: ['./edit-accessory.component.css'],
})
export class EditAccessoryComponent {
  editAccessoryForm!: FormGroup;
  message!: string;
  messageType!: string;
  currentImage!: any;
  accessoryId: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accService: AccessoireService,
    private config: Config
  ) {
    this.accessoryId = this.route.snapshot.params['id']; // Get ID from route
  }

  ngOnInit(): void {
    this.editAccessoryForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      prixAchat: [0, Validators.required],
      prixVente: [0, Validators.required],
      qte: [0, Validators.required],
      image: [null],
      active: [1, Validators.required],
    });

    this.loadAccessory();
  }

  loadAccessory() {
    this.accService.getAccessoire(this.accessoryId).subscribe({
      next: (response) => {
        if (response) {
          this.editAccessoryForm.patchValue(response);
          this.currentImage = response.image;
        }
      },
      error: (error) => {
        console.log(error);

        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.currentImage = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const file = inputElement.files[0];
      this.currentImage = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.editAccessoryForm.controls).forEach((key) => {
      const controlValue = this.editAccessoryForm.get(key)?.value;
      if (key && controlValue != null) {
        formData.append(key, controlValue);
      }
    });

    if (
      (this.currentImage != null && this.currentImage instanceof Blob) ||
      this.currentImage instanceof File
    ) {
      formData.append('image', this.currentImage);
    }
    for (let [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    this.accService.updateAccessoire(formData, this.accessoryId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.messageType = 'success';
      },
      error: (error) => {
        console.log(error);

        this.message = error.error.message;
        this.messageType = 'danger';
      },
    });
  }

  returnImg(image: any) {
    if (typeof image === 'string') {
      return this.config.getPhotoPath('accessoires') + image;
    } else if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else {
      return null;
    }
  }
}
