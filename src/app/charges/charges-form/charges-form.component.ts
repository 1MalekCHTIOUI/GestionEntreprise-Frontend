import { Component } from '@angular/core';
import { Charge } from '../../models/charge.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChargesService } from '../charges.service';

@Component({
  selector: 'app-charges-form',
  templateUrl: './charges-form.component.html',
  styleUrl: './charges-form.component.css',
})
export class ChargesFormComponent {
  chargeForm!: FormGroup;
  isEditMode = false;
  chargeId?: number;

  constructor(
    private fb: FormBuilder,
    private chargeService: ChargesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.chargeId = +params['id'];
        this.loadCharge(this.chargeId);
      }
    });
  }

  initForm() {
    this.chargeForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      valeur: [0, [Validators.required, Validators.min(0)]],
      repetition: [1, [Validators.required, Validators.min(1)]],
      active: [true, Validators.required],
    });
  }

  loadCharge(id: number) {
    this.chargeService.getCharge(id).subscribe((charge: Charge) => {
      this.chargeForm.patchValue(charge);
    });
  }

  submitForm() {
    if (this.chargeForm.valid) {
      const charge: Charge = this.chargeForm.value;
      if (this.isEditMode && this.chargeId !== undefined) {
        this.chargeService.updateCharge(this.chargeId, charge).subscribe(() => {
          this.router.navigate(['/charges']);
        });
      } else {
        this.chargeService.addCharge(charge).subscribe(() => {
          this.router.navigate(['/charges']);
        });
      }
    }
  }
}
