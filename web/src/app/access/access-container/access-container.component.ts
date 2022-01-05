import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { LogoModule } from '../../logo/logo.module';
import { FlexModule } from '@angular/flex-layout';

/**
 * This component acts as a layout for access components
 */
@Component({
  selector: 'app-access-container',
  templateUrl: './access-container.component.html',
  styleUrls: ['./access-container.component.scss'],
})
export class AccessContainerComponent {
  constructor() {}
}

@NgModule({
  declarations: [AccessContainerComponent],
  exports: [AccessContainerComponent],
  imports: [CommonModule, LogoModule, FlexModule],
})
export class AccessContainerModule {}
