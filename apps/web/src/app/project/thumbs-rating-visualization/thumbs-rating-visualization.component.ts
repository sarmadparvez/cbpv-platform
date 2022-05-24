import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Question } from '../../../gen/api/task';
import { MatCardModule } from '@angular/material/card';
import { FlexModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-thumbs-rating-visualization',
  templateUrl: './thumbs-rating-visualization.component.html',
  styleUrls: ['./thumbs-rating-visualization.component.scss'],
})
export class ThumbsRatingVisualizationComponent {
  @Input() question!: Question;
  @Input() thumbsUpCount!: number;
  @Input() thumbsDownCount!: number;
  constructor() {}
}
@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexModule,
    TranslateModule,
    MatIconModule,
    MatBadgeModule,
  ],
  declarations: [ThumbsRatingVisualizationComponent],
  exports: [ThumbsRatingVisualizationComponent],
})
export class ThumbsRatingVisualizationModule {}
