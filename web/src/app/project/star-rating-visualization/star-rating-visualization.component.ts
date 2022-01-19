import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionStats } from '../feedback-visualization/feedback-visualization.component';
import { ChartData } from '../radio-feedback-visualization/radio-feedback-visualization.component';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { NgxChartsModule, PieChartModule } from '@swimlane/ngx-charts';
import { MatCardModule } from '@angular/material/card';

/**
 * The component users @swimlane/ngx-charts npm package to show bar chart.
 * The solution is based on https://stackblitz.com/edit/swimlane-pie-chart?embed=1&file=app/app.component.ts
 */
@Component({
  selector: 'app-star-rating-visualization',
  templateUrl: './star-rating-visualization.component.html',
  styleUrls: ['./star-rating-visualization.component.scss'],
})
export class StarRatingVisualizationComponent implements OnInit {
  @Input() questionStats: QuestionStats;
  chartData: ChartData[] = [];
  view = [800, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  yAxisLabel = 'Star Rating';
  showYAxisLabel = true;
  xAxisLabel: string = 'Number of Users';

  constructor() {
    Window['srself'] = this;
  }

  ngOnInit(): void {
    this.formatStatsForChart();
  }

  formatStatsForChart() {
    this.initializeData();

    this.questionStats.stats.forEach(stat => {
      const data = this.chartData.find(
        d => d.name === stat.starRatingAnswer.toString() + ' star',
      );
      if (data) {
        data.value = stat.starRatingAnswerCount;
      }
    });
  }
  xAxisTickFormatting(xTick: number) {
    if (xTick % 1 === 0) {
      return xTick;
    } else {
      return '';
    }
  }

  initializeData() {
    const stars = [5, 4, 3, 2, 1];
    stars.forEach(star => {
      this.chartData.push({
        name: star.toString() + ' star',
        value: 0,
      });
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FlexModule,
    NgxChartsModule,
    MatCardModule,
  ],
  declarations: [StarRatingVisualizationComponent],
  exports: [StarRatingVisualizationComponent],
})
export class StarRatingVisualizationModule {}
