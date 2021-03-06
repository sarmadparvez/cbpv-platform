import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { Feedback, Task, TasksService } from '../../../gen/api/task';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';
import { ImagePrototypeModule } from '../../project/image-prototype/image-prototype.component';
import { IframePrototypeModule } from '../../project/iframe-prototype/iframe-prototype.component';
import { TextPrototypeModule } from '../../project/text-prototype/text-prototype.component';
import { QuestionnaireAnswerModule } from '../questionnaire-answer/questionnaire-answer.component';
import { BasicTaskDetailModule } from '../basic-task-detail/basic-task-detail.component';

@Component({
  selector: 'app-task-feedback',
  templateUrl: './task-feedback.component.html',
  styleUrls: ['./task-feedback.component.scss'],
})
export class TaskFeedbackComponent implements OnInit {
  @Input() task = new ReplaySubject<Task>(1);
  @Input() feedback!: Feedback;
  @Input() readonly!: boolean;
  @Input() applyContainerClass = true;
  PrototypeFormatEnum = Task.PrototypeFormatEnum;
  TestTypeEnum = Task.TestTypeEnum;
  prototypeNumberToEvaluate: number | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly taskService: TasksService
  ) {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId) {
      this.getTask(taskId);
    }
  }

  ngOnInit() {
    if (this.feedback?.prototypeNumber) {
      this.prototypeNumberToEvaluate = this.feedback.prototypeNumber;
    }
  }

  async getTask(taskId: string) {
    const task = await firstValueFrom(this.taskService.findOne(taskId));

    if (task.testType === Task.TestTypeEnum.Split) {
      const response = await firstValueFrom(
        this.taskService.generatePrototypeNumber(taskId)
      );
      this.prototypeNumberToEvaluate = response.prototypeNumber;
    }

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
    QuestionnaireAnswerModule,
    BasicTaskDetailModule,
  ],
  declarations: [TaskFeedbackComponent],
  exports: [TaskFeedbackComponent],
})
export class TaskFeedbackModule {}
