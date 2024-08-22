import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss',
})
export class ChartComponent {
  @Input('type') chartType!: ChartType;
  @Input('labels') chartLabels!: any;
  @Input('label') chartLabel!: any;

  @Input('datasets') chartDatasets!: any;

  public pieChartOptions: ChartOptions<any> = {
    responsive: false,
  };

  public pieChartLegend = true;
  public pieChartPlugins = [];
}
