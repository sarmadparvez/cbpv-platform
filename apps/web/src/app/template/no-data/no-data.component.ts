import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-data',
  templateUrl: './no-data.component.html',
  styleUrls: ['./no-data.component.scss'],
})
export class NoDataComponent {
  constructor() {}
}

@NgModule({
  declarations: [NoDataComponent],
  imports: [CommonModule, TranslateModule],
  exports: [NoDataComponent],
})
export class NoDataModule {}
