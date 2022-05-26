import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-report-misuse',
  templateUrl: './report-misuse.component.html',
  styleUrls: ['./report-misuse.component.scss'],
})
export class ReportMisuseComponent {
  form = this.fb.group({
    description: ['', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportMisuseComponent>,
    private snackbar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  report() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close();

    this.snackbar.open(
      this.translateService.instant('notification.reportMisuseSuccess'),
      '',
      { duration: 5000 }
    );
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatButtonModule,
  ],
  declarations: [ReportMisuseComponent],
})
export class ReportMisuseModule {}
