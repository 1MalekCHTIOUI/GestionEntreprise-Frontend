import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Config } from '../../configs/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-parameter',
  templateUrl: './add-parameter.component.html',
  styleUrl: './add-parameter.component.css',
})
export class AddParameterComponent {
  parameter: any = {};

  constructor(
    private http: HttpClient,
    private config: Config,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadParameter();
  }

  loadParameter(): void {
    this.http
      .get<any>(this.config.getAPIPath() + '/parameters/1', {
        responseType: 'json',
      })
      .subscribe(
        (data) => {
          console.log(data);
          this.parameter = data;
        },
        (error: HttpErrorResponse) => {
          console.error('Error loading parameter:', error.message);
        }
      );
  }

  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.parameter[field] = file;
    }
  }

  onSubmit(): void {
    const formData: FormData = new FormData();
    formData.append('timbre_fiscale', this.parameter.timbre_fiscale);
    formData.append('cachet', this.parameter.cachet);
    formData.append('logo', this.parameter.logo);
    formData.append('titre', this.parameter.titre);
    formData.append('tva', this.parameter.tva);
    formData.append('fodec', this.parameter.fodec);
    formData.append('tel', this.parameter.tel);
    formData.append('email', this.parameter.email);
    formData.append('address', this.parameter.address);
    formData.append('numero_fiscal', this.parameter.numero_fiscal);
    formData.append('_method', 'PUT');
    this.http
      .post(`${this.config.getAPIPath()}/parameters/1`, formData)
      .subscribe(
        (response) => {
          console.log('Success!', response);
          // this.router.navigateByUrl('/parameters');
        },
        (error) => {
          console.error('Error!', error);
        }
      );
  }
}
