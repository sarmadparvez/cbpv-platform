import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CreateTaskDto, Task } from '../../../../gen/api/task';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';
import {
  TextFormComponent,
  TextFormData,
} from '../text-form/text-form.component';

@Component({
  selector: 'app-text-prototype',
  templateUrl: './text-prototype.component.html',
  styleUrls: ['./text-prototype.component.scss'],
})
export class TextPrototypeComponent {
  @Input() task: ReplaySubject<Task>;
  TestTypeEnum = CreateTaskDto.TestTypeEnum;
  constructor(private readonly dialog: MatDialog) {}

  async openEditDialog(splitNum: number) {
    const task = await firstValueFrom(this.task);

    this.dialog
      .open(TextFormComponent, {
        data: <TextFormData>{
          splitNo: splitNum,
          task: task,
        },
        disableClose: true,
        width: '55vw',
      })
      .afterClosed()
      .subscribe((text: string) => {
        if (text) {
          if (splitNum === 1) {
            task.textualDescription1 = text;
            this.task.next(task);
          } else {
            task.textualDescription2 = text;
            this.task.next(task);
          }
        }
      });
  }
}

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    TranslateModule,
    MatDividerModule,
    MatButtonModule,
    FlexModule,
  ],
  declarations: [TextPrototypeComponent],
  exports: [TextPrototypeComponent],
})
export class TextPrototypeModule {}
