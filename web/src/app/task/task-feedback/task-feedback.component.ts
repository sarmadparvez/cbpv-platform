import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { Task, TasksService } from '../../../../gen/api/task';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { ImagePrototypeModule } from '../../project/image-prototype/image-prototype.component';
import { IframePrototypeModule } from '../../project/iframe-prototype/iframe-prototype.component';
import { TextPrototypeModule } from '../../project/text-prototype/text-prototype.component';

@Component({
  selector: 'app-task-feedback',
  templateUrl: './task-feedback.component.html',
  styleUrls: ['./task-feedback.component.scss'],
})
export class TaskFeedbackComponent {
  @Input() task = new ReplaySubject<Task>(1);
  PrototypeFormatEnum = Task.PrototypeFormatEnum;
  TestTypeEnum = Task.TestTypeEnum;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly taskService: TasksService,
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    this.getTask(taskId);
  }

  async getTask(taskId: string) {
    const task = await firstValueFrom(this.taskService.findOne(taskId));
    this.task.next(task);
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    FlexModule,
    ImagePrototypeModule,
    IframePrototypeModule,
    TextPrototypeModule,
  ],
  declarations: [TaskFeedbackComponent],
})
export class TaskFeedbackModule {}
