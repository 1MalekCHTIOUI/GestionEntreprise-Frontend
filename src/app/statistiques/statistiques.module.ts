import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListStatComponent } from './list-stat/list-stat.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';

const routes: Routes = [
  {
    path: 'stats',
    component: ListStatComponent,
  },
];

@NgModule({
  declarations: [ListStatComponent, ChartComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    BaseChartDirective,
  ],
  providers: [DatePipe, provideCharts(withDefaultRegisterables())],
})
export class StatistiquesModule {}
