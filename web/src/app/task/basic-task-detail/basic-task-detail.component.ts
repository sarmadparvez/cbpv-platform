import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaySubject } from 'rxjs';
import { Task } from '../../../../gen/api/task';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'app-basic-task-detail',
  templateUrl: './basic-task-detail.component.html',
  styleUrls: ['./basic-task-detail.component.scss'],
})
export class BasicTaskDetailComponent {
  @Input() task = new ReplaySubject<Task>(1);
  constructor() {}
}
@NgModule({
  imports: [CommonModule, MatCardModule, TranslateModule, FlexModule],
  declarations: [BasicTaskDetailComponent],
  exports: [BasicTaskDetailComponent],
})
export class BasicTaskDetailModule {}
