import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StatistiquesService } from '../statistiques.service';
import { ChartOptions, ChartType, ChartData, LabelItem } from 'chart.js';

@Component({
  selector: 'app-list-stat',
  templateUrl: './list-stat.component.html',
  styleUrl: './list-stat.component.css',
})
export class ListStatComponent {
  statisticsForm: FormGroup;
  benefitsReport: any[] = [];
  chargesReport!: any;
  devisReport: any = {};
  devisStatusReport: any = {};
  productsReport: any[] = [];
  facturesReport!: any;
  clientsReport: any[] = [];
  devisDifference: any[] = [];

  profitsData: any;

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels: any = [];
  public clientLabels: any = [];
  public devisStatusLabels: any = [];
  public pieChartDatasets: any = [
    {
      data: [],
    },
  ];
  public clientDatasets: any = [
    {
      data: [],
    },
  ];
  public devisStatusDatasets: any = [
    {
      data: [],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(
    private fb: FormBuilder,
    private statisticsService: StatistiquesService
  ) {
    this.statisticsForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  getReports(): void {
    if (this.statisticsForm.valid) {
      const { startDate, endDate } = this.statisticsForm.value;

      // this.statisticsService.getBenefitsReport(startDate, endDate).subscribe(data => {
      //   this.benefitsReport = data;
      // });

      this.statisticsService
        .getChargesReport(startDate, endDate)
        .subscribe((data) => {
          this.chargesReport = data;
        });

      this.statisticsService.getDevis(startDate, endDate).subscribe((data) => {
        console.log(data);

        this.devisReport = data;
      });

      this.statisticsService
        .getProductsReport(startDate, endDate)
        .subscribe((data) => {
          console.log('PRODUCTS REPORT', data);

          this.productsReport = data;
          this.pieChartLabels = data.map((product) => product.titre);
          this.pieChartDatasets[0].data = data.map(
            (product) => product.total_quantity_sold
          );
        });
      this.statisticsService
        .getDevisStatusReport(startDate, endDate)
        .subscribe((data: any) => {
          console.log(data);

          const statistics = data.statistics;
          const statisticsArray = Object.entries(statistics).map(
            ([key, value]) => ({ key, value })
          );

          this.devisStatusReport = statisticsArray;
          this.devisStatusLabels = statisticsArray.map((stat: any) => stat.key);
          this.devisStatusDatasets[0].data = statisticsArray.map(
            (stat: any) => stat.value
          );
        });

      this.statisticsService
        .getDevisDiff(startDate, endDate)
        .subscribe((data) => {
          this.devisDifference = data;
        });

      this.statisticsService
        .getProfitsReport(startDate, endDate)
        .subscribe((data) => {
          this.profitsData = data;
        });

      this.statisticsService
        .getSuccessfulClients(startDate, endDate)
        .subscribe((data) => {
          this.clientsReport = data;
          this.clientLabels = data.map(
            (client) => client.nom + ' ' + client.prenom
          );
          this.clientDatasets[0].data = data.map(
            (client) => client.total_achats
          );
        });

      this.statisticsService
        .getFacturesReport(startDate, endDate)
        .subscribe((data) => {
          this.facturesReport = data;
        });
    }
  }

  returnNumber(value: any): number {
    return Number(value);
  }
}
