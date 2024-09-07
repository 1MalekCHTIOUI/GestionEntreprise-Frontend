import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Editor, Toolbar } from 'ngx-editor';
import { provideNativeDateAdapter } from '@angular/material/core';

import { ClientService } from '../services/client.service';
import { CountryService } from '../services/country.service';
import { StateService } from '../services/state.service';
import { Client } from '../../models/client.model';
import { Country } from '../../models/country.model';
import { State } from '../../models/state.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadValidators } from '@iplab/ngx-file-upload';
import { LabelService } from '../services/label.service';
import { Label } from '../../models/label.model';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-edit-client',
  providers: [provideNativeDateAdapter()],
  templateUrl: './edit-client2.component.html',
  styleUrls: ['./edit-client.component.scss'],
})
export class EditClientComponent implements OnInit, OnDestroy {
  editor!: Editor;
  html = '';
  // client: Client = {
  //   id: 0,
  //   prenom: '',
  //   nom_societe: '',
  //   nom: '',
  //   tel1: '',
  //   tel2: '',
  //   whatsapp: '',
  //   facebook_page: '',
  //   instagram_account: '',
  //   linkedin_page: '',
  //   site_web: '',
  //   email: '',
  //   pays_id: 0,
  //   gouvernerat_id: 0,
  //   adresse: '',
  //   matricul_fiscal: '',
  //   secteur: '',
  //   notes: '',
  //   label_id: 0,
  //   logo: '',
  // };
  clientId!: number;
  countries: Country[] = [];
  states: State[] = [];
  labels: Label[] = [];

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  public multiple: boolean = false;
  private filesControl = new FormControl<File[]>(
    [],
    FileUploadValidators.filesLimit(2)
  );
  clientForm: FormGroup;
  currentImage!: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private countryService: CountryService,
    private stateService: StateService,
    private labelService: LabelService,
    private config: Config
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
    this.editor = new Editor();
    this.clientId = this.route.snapshot.params['id'];
    this.loadClient();
    this.loadCountries();
    this.loadLabels();
    this.clientForm.get('pays_id')?.valueChanges.subscribe((countryId) => {
      this.loadStates(countryId);
    });
    // Add logging to ngModel changes
    // this.logFieldChanges();
  }
  // logFieldChanges() {
  //   const fields = [
  //     'prenom',
  //     'nom',
  //     'email',
  //     'tel1',
  //     'tel2',
  //     'adresse',
  //     'matricul_fiscal',
  //     'secteur',
  //     'facebook_page',
  //     'whatsapp',
  //     'instagram_account',
  //     'linkedin_page',
  //   ];
  //   fields.forEach((field) => {
  //     Object.defineProperty(this.client, field, {
  //       set: (value) => {
  //         console.log(`Field ${field} changed to: `, value);
  //         (this.client as any)[`_${field}`] = value;
  //       },
  //       get: () => {
  //         return (this.client as any)[`_${field}`];
  //       },
  //     });
  //   });
  // }
  public demoForm = new FormGroup({
    files: this.filesControl,
  });

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  loadClient() {
    this.clientService.getClient(this.clientId).subscribe(
      (data: any) => {
        this.clientForm.patchValue(data.client);
        this.loadStates(data.client.pays_id);
        this.currentImage = data.client.logo;
      },
      (error) => {
        console.error('Error loading client', error);
      }
    );
  }

  loadCountries() {
    this.countryService.getCountries().subscribe(
      (data) => {
        this.countries = data;
      },
      (error) => {
        console.error('Error loading countries', error);
      }
    );
  }

  loadStates(countryId: number) {
    this.stateService.getStatesByCountry(countryId).subscribe(
      (data) => {
        this.states = data;
      },
      (error) => {
        console.error('Error loading states', error);
      }
    );
  }
  returnImg(image: any) {
    if (typeof image === 'string') {
      return this.config.getPhotoPath('clients') + image;
    } else if (image instanceof Blob || image instanceof File) {
      return URL.createObjectURL(image);
    } else {
      return null;
    }
  }
  loadLabels(): void {
    this.labelService.getLabels().subscribe(
      (response) => {
        console.log(response);

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
  logFormValidationErrors(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const controlErrors = formGroup.get(key)?.errors;
      if (controlErrors) {
        console.error(`Form control ${key} errors:`, controlErrors);
      }
    });
  }
  success: string = '';
  error: string = '';
  saveClient() {
    if (this.clientForm.valid) {
      const clientData: Client = this.clientForm.value;

      const files = this.demoForm.get('files')?.value;
      const file: File | null = files ? files[0] : null;

      const formData = new FormData();
      Object.keys(this.clientForm.controls).forEach((key) => {
        const controlValue = this.clientForm.get(key)?.value;
        if (key && controlValue != null) {
          formData.append(key, controlValue);
        }
      });

      if (file) {
        console.log('File appended');

        formData.append('logo', file);
      }
      for (var pair of (formData as any).entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      this.clientService.updateClient(this.clientId, formData).subscribe(
        (res) => {
          console.log('Client updated successfully', res);
          this.success = 'Client updated successfully';
          // this.navigateToList();
        },
        (error) => {
          console.error('Error updating client', error);
          this.error = error.error.message;
          this.logFormValidationErrors(this.clientForm);
        }
      );
    }
  }

  navigateToList() {
    // this.router.navigate(['/SuperAdmin/clients-list']);
    this.router.navigate(['/clients']);
  }

  cancelEdit() {
    this.navigateToList();
  }
}
