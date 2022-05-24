import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../../gen/api/task/model/models';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { TaskFormatSelectorCardModule } from '../task-format-selector-card/task-format-selector-card.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent {
  @Input() task!: Task;
}

/**
 * Project module
 * */
@NgModule({
  declarations: [TaskDetailComponent],
  exports: [TaskDetailComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    FlexModule,
    TaskFormatSelectorCardModule,
    MatChipsModule,
  ],
})
export class TaskDetailModule {}
