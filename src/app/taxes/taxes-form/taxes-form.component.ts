import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaxesService } from '../taxes.service';

@Component({
  selector: 'app-taxes-form',
  templateUrl: './taxes-form.component.html',
  styleUrl: './taxes-form.component.css',
})
export class TaxesFormComponent {
  taxForm!: FormGroup;
  isEditMode = false;
  taxId!: number;

  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private taxService: TaxesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taxForm = this.fb.group({
      name: ['', Validators.required],
      rate: ['', [Validators.required, Validators.min(0)]],
    });

    // Check if the form is in edit mode
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.taxId = params['id'];
        this.loadTax(this.taxId);
      }
    });
  }

  loadTax(id: number): void {
    this.taxService.getTaxe(id).subscribe(
      (tax: any) => {
        this.taxForm.patchValue(tax);
      },
      (error) => {
        console.error('Error fetching tax data:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.taxForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.taxService.updateTaxe(this.taxId, this.taxForm.value).subscribe(
        () => {
          this.successMessage = 'Tax updated successfully';
          this.errorMessage = '';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        (error) => {
          console.error('Error updating tax:', error);
          this.errorMessage = 'Error updating tax';
        }
      );
    } else {
      this.taxService.addTaxe(this.taxForm.value).subscribe({
        next: () => {
          console.log('Tax added successfully');
          this.router.navigate(['/taxes']);
        },
        error: (error) => {
          console.error('Error adding tax:', error);
        },
      });
    }
  }
}
