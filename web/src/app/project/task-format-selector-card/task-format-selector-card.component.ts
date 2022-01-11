import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import TestTypeEnum = CreateTaskDto.TestTypeEnum;
import PrototypeFormatEnum = CreateTaskDto.PrototypeFormatEnum;
import { CreateTaskDto } from '../../../../gen/api/task';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-format-selector-card',
  templateUrl: './task-format-selector-card.component.html',
  styleUrls: ['./task-format-selector-card.component.scss'],
})
export class TaskFormatSelectorCardComponent {
  TestTypeEnum = TestTypeEnum;
  @Input() testType: TestTypeEnum;
  @Input() title: string;
  @Input() subtitle: string;
  @Input() note: string;
  @Input() icon: string;
  @Input() selectorForPrototypeFormat: PrototypeFormatEnum;
  @Input() selectedPrototypeFormat: PrototypeFormatEnum;
  @Output() testTypeEmitter = new EventEmitter<TestTypeEnum>();

  constructor() {}

  testTypeChange(event: MatRadioChange) {
    this.testTypeEmitter.emit(event.value);
  }
}
/**
 * Project module
 * */
@NgModule({
  declarations: [TaskFormatSelectorCardComponent],
  imports: [
    CommonModule,
    FlexModule,
    TranslateModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule,
  ],
  exports: [TaskFormatSelectorCardComponent],
})
export class TaskFormatSelectorCardModule {}
