import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccessoireService } from '../accessoire.service';

@Component({
  selector: 'app-add-accessory',
  templateUrl: './add-accessory.component.html',
  styleUrls: ['./add-accessory.component.css'],
})
export class AddAccessoryComponent {
  addAccessoryForm!: FormGroup;
  message!: string;
  messageType!: string;
  currentImage!: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private accService: AccessoireService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.addAccessoryForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      prixAchat: [null, Validators.required],
      prixVente: [null, Validators.required],
      qte: [null, Validators.required],
      image: [null],
      active: [1, Validators.required],
    });
  }

  onFileChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      const file = inputElement.files[0];
      this.currentImage = file;
    }
  }

  onSubmit() {
    const formData = new FormData();
    Object.keys(this.addAccessoryForm.controls).forEach((key) => {
      const controlValue = this.addAccessoryForm.get(key)?.value;
      if (key && controlValue != null) {
        formData.append(key, controlValue);
      }
    });

    if (
      (this.currentImage != null && this.currentImage instanceof Blob) ||
      this.currentImage instanceof File
    ) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (allowedImageTypes.includes(this.currentImage.type)) {
        formData.append('image', this.currentImage);
      } else {
        this.message = 'Type image invalide';
        this.messageType = 'danger';
        return;
      }
    }
    for (let [key, value] of (formData as any).entries()) {
      console.log(`${key}: ${value}`);
    }

    this.accService.addAccessoire(formData).subscribe({
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
    return URL.createObjectURL(image);
  }
}
