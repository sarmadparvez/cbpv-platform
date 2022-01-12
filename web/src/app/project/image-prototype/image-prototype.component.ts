import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTaskDto, Task } from 'gen/api/task/model/models';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { ImageUploaderModule } from '../image-uploader/image-uploader.component';
import TestTypeEnum = CreateTaskDto.TestTypeEnum;
import { TasksService } from '../../../../gen/api/task';

@Component({
  selector: 'app-image-prototype',
  templateUrl: './image-prototype.component.html',
  styleUrls: ['./image-prototype.component.scss'],
})
export class ImagePrototypeComponent {
  @Input() task: Task;
  TestTypeEnum = TestTypeEnum;

  constructor(private readonly taskService: TasksService) {}

  imageUploadComplete(urls: string[], splitNumber: number) {}
}

/**
 * Project module
 * */
@NgModule({
  declarations: [ImagePrototypeComponent],
  exports: [ImagePrototypeComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    TranslateModule,
    ImageUploaderModule,
  ],
})
export class ImagePrototypeModule {}
