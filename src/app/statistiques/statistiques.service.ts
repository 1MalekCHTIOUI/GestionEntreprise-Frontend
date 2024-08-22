import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Config } from '../configs/config';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StatistiquesService {
  constructor(
    private http: HttpClient,
    private config: Config,
    private datePipe: DatePipe
  ) {}
  API = this.config.getAPIPath() + '/stats';
  getProductsReport(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/products-success-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }

  getDevisDiff(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/devis-comparison-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }

  getSuccessfulClients(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/clients-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }

  getDevis(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/devis-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }

  getChargesReport(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/charges-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }

  getFacturesReport(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/factures-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }

  getProfitsReport(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/profits-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }


  getDevisStatusReport(startDate: string, endDate: string) {
    const formattedStartDate = this.datePipe.transform(startDate, 'dd/MM/yyyy');
    const formattedEndDate = this.datePipe.transform(endDate, 'dd/MM/yyyy');

    return this.http.get<any[]>(
      `${this.API}/devis-status-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
  }
}
