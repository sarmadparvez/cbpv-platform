import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserReportsService } from '../../../gen/api/admin';
import { parseError } from '../../error/parse-error';
import { Feedback } from '../../../gen/api/task';
import { firstValueFrom } from 'rxjs';

export interface ReportMisuseData {
  projectId: string;
  feedback: Feedback;
}

@Component({
  selector: 'app-report-misuse',
  templateUrl: './report-misuse.component.html',
  styleUrls: ['./report-misuse.component.scss'],
})
export class ReportMisuseComponent {
  form = this.fb.group({
    description: ['', Validators.required],
  });
  feedback: Feedback;
  projectId: string;

  constructor(
    private readonly fb: FormBuilder,
    private dialogRef: MatDialogRef<ReportMisuseComponent>,
    private snackbar: MatSnackBar,
    private translateService: TranslateService,
    private userReportService: UserReportsService,
    @Inject(MAT_DIALOG_DATA) data: ReportMisuseData
  ) {
    this.feedback = data.feedback;
    this.projectId = data.projectId;
  }

  async report() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      await firstValueFrom(
        this.userReportService.create({
          feedbackId: this.feedback.id,
          taskId: this.feedback.taskId,
          reportedUserId: this.feedback.userId,
          projectId: this.projectId,
          description: this.form.get('description')?.value,
        })
      );
      this.snackbar.open(
        this.translateService.instant('notification.reportMisuseSuccess'),
        '',
        { duration: 5000 }
      );
      this.dialogRef.close();
    } catch (err) {
      console.log('Unable to register ', err);
      const error = parseError(err);
      if (error?.message) {
        this.snackbar.open(error.message, '', {
          duration: 5000,
        });
      }
    }
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
