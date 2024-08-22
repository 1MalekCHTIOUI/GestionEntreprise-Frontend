import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Config } from '../../configs/config';

@Component({
  selector: 'app-show-parameter',
  templateUrl: './show-parameter.component.html',
  styleUrl: './show-parameter.component.css',
})
export class ShowParameterComponent {
  parameter: any = {};
  constructor(private http: HttpClient, private config: Config) {}

  ngOnInit(): void {
    this.getParam();
  }

  getParam() {
    this.http
      .get<any>(`${this.config.getAPIPath()}/parameters/1`)
      .subscribe((data) => {
        console.log(data);
        this.parameter = data;
      });
  }

  returnImg(image: string) {
    return this.config.getPhotoPath('parameters') + image;
  }
}
