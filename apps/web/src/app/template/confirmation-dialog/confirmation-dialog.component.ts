import { Component, Inject, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationDialogData {
  title: string;
  message: string;
}
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
})
export class ConfirmationDialogComponent {
  @Input() title: string;
  @Input() message: string;
  constructor(@Inject(MAT_DIALOG_DATA) private data: ConfirmationDialogData) {
    this.title = this.data?.title;
    this.message = this.data?.message;
  }
}

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  declarations: [ConfirmationDialogComponent],
})
export class ConfirmationDialogModule {}
