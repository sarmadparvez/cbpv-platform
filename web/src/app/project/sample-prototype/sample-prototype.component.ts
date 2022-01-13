import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';

@Component({
  selector: 'app-sample-prototype',
  templateUrl: './sample-prototype.component.html',
  styleUrls: ['./sample-prototype.component.scss'],
})
export class SamplePrototypeComponent {
  constructor() {}
}

@NgModule({
  imports: [CommonModule, FlexModule],
  declarations: [SamplePrototypeComponent],
  exports: [SamplePrototypeComponent],
})
export class SamplePrototypeModule {}
