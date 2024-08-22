import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { provideNativeDateAdapter } from '@angular/material/core';
import { ClientService } from '../services/client.service';
import { CountryService } from '../services/country.service';
import { StateService } from '../services/state.service';
import { LabelService } from '../services/label.service';
import { Country } from '../../models/interface/country.model';
import { State } from '../../models/interface/state.model';
import { Label } from '../../models/interface/label.model';
import { Client } from '../../models/interface/client.model';
import { FileUploadValidators } from '@iplab/ngx-file-upload';

@Component({
  selector: 'app-add-client',

  templateUrl: './add-client2.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [provideNativeDateAdapter()],
})
export class AddClientComponent implements OnInit {
  clientForm: FormGroup;
  countries: Country[] = [];
  states: State[] = [];
  labels: Label[] = [];
  fileToUpload: File | null = null;
  public multiple: boolean = false;
  private filesControl = new FormControl<File[]>(
    [],
    FileUploadValidators.filesLimit(2)
  );

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private countryService: CountryService,
    private stateService: StateService,
    private labelService: LabelService
  ) {
    this.clientForm = this.fb.group({
      prenom: [''],
      nom: [''],
      email: [''],
      tel1: [''],
      tel2: [''],
      adresse: [''],
      pays_id: [''],
      gouvernerat_id: [''],
      label_id: [''],
      matricul_fiscal: [''],
      secteur: [''],
      notes: [''],
      nom_societe: [''],
      site_web: [''],
      facebook_page: [''],
      whatsapp: [''], // Validator removed
      instagram_account: [''],
      linkedin_page: [''],
    });
  }
  ngOnInit(): void {
    this.loadCountries();
    this.loadLabels();
    this.clientForm.get('pays_id')?.valueChanges.subscribe((countryId) => {
      this.loadStates(countryId);
    });
  }

  public demoForm = new FormGroup({
    files: this.filesControl,
  });

  loadCountries(): void {
    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  loadStates(countryId: number): void {
    this.stateService.getStatesByCountry(countryId).subscribe((states) => {
      this.states = states;
    });
  }

  loadLabels(): void {
    this.labelService.getLabels().subscribe(
      (response) => {
        if (response.success) {
          this.labels = response.data;
        } else {
          console.error('Failed to load labels');
        }
      },
      (error) => {
        console.error('Error loading labels:', error);
      }
    );
  }

  // handleFileInput(event: any): void {
  //   const files = event.target.files;
  //   if (files.length > 0) {
  //     this.fileToUpload = files[0];
  //   }
  // }

  // onFileChange(event: Event): void {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files) {
  //     const file = inputElement.files[0];
  //     this.fileToUpload = file;
  //   }
  // }

  onSubmit(): void {
    if (this.clientForm.valid) {
      const clientData: Client = this.clientForm.value;
      const files = this.demoForm.get('files')?.value;
      const file = files ? files[0] : null;
      this.clientService.addClient(clientData, file).subscribe(
        (response) => {
          console.log('Client added successfully:', response);
        },
        (error) => {
          console.error('Error adding client:', error);
        }
      );
    } else {
      console.error('Form is invalid');
      this.logFormValidationErrors(this.clientForm);
    }
  }

  logFormValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors) {
        console.error(`Form control ${key} errors:`, controlErrors);
      }
    });
  }

  onCancel(): void {
    // Handle the cancel action, e.g., navigate away or clear the form
  }
}
