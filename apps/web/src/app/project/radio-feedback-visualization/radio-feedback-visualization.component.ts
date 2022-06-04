import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionStats } from '../feedback-visualization/feedback-visualization.component';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import {
  LegendPosition,
  NgxChartsModule,
  PieChartModule,
} from '@swimlane/ngx-charts';

/**
 * The component users @swimlane/ngx-charts npm package to show pie chart.
 * The solution is based on https://stackblitz.com/edit/swimlane-pie-chart?embed=1&file=app/app.component.ts
 */

export interface ChartData {
  name: string;
  value: number;
}
@Component({
  selector: 'app-radio-feedback-visualization',
  templateUrl: './radio-feedback-visualization.component.html',
  styleUrls: ['./radio-feedback-visualization.component.scss'],
})
export class RadioFeedbackVisualizationComponent implements OnInit {
  @Input() questionStats!: QuestionStats;
  chartData: ChartData[] = [];
  view: [number, number] = [800, 500];
  gradient = true;
  showLegend = true;
  showLabels = true;
  isDoughnut = false;
  legendPosition = LegendPosition.Below;

  constructor() {}

  ngOnInit(): void {
    this.formatStatsForChart();
  }

  formatStatsForChart() {
    this.questionStats.stats.forEach((stat) => {
      this.chartData.push({
        name: stat.radioAnswer,
        value: stat.radioAnswerCount,
      });
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexModule,
    TranslateModule,
    PieChartModule,
    NgxChartsModule,
  ],
  declarations: [RadioFeedbackVisualizationComponent],
  exports: [RadioFeedbackVisualizationComponent],
})
export class RadioFeedbackVisualizationModule {}
