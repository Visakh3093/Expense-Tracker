import { Component, Input, input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData, ChartType } from 'chart.js';
import { isEmpty } from 'lodash';
import { BaseChartDirective } from 'ng2-charts';
import { SelectIncomeLabel } from '../../common/chartData/chart.selector';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './doughnut-chart.component.html',
  styleUrl: './doughnut-chart.component.css'
})
export class DoughnutChartComponent {
  @Input() doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  @Input() doughnutChartType: ChartType = 'doughnut';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    console.log(event, active);
  }

}


 