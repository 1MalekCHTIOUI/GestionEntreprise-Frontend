import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-add-parameter',
  templateUrl: './add-parameter.component.html',
  styleUrl: './add-parameter.component.css',
})
export class AddParameterComponent {
  parameter: any = {};

  constructor(private http: HttpClient, private config: Config) {}

  ngOnInit(): void {
    this.loadParameter();
  }

  loadParameter(): void {
    this.http.get<any>('api/parameters/1').subscribe((data) => {
      this.parameter = data;
    });
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
    formData.append('tel', this.parameter.tel);
    formData.append('email', this.parameter.email);
    formData.append('address', this.parameter.address);
    formData.append('numero_fiscal', this.parameter.numero_fiscal);

    this.http.put(`${this.config.getAPIPath()}/parameters`, formData).subscribe(
      (response) => {
        console.log('Success!', response);
        // this.loadParameter();
      },
      (error) => {
        console.error('Error!', error);
      }
    );
  }
}
