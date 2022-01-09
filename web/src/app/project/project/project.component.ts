import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  CreateProjectDto,
  Project,
  ProjectsService,
  UpdateProjectDto,
} from '../../../../gen/api/task';
import { firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  constructor(
    private readonly fb: FormBuilder,
    private readonly projectService: ProjectsService,
    private readonly snackBar: MatSnackBar,
    private dialog: MatDialogRef<ProjectComponent>,
    private translateService: TranslateService,
    @Inject(MAT_DIALOG_DATA) private project: Project,
  ) {
    if (this.project) {
      this.form.patchValue(this.project);
    }
  }

  form = this.fb.group({
    title: ['', Validators.required],
    description: [null],
  });

  async saveProject() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    let successMsg = '';
    let errorMsg = '';
    try {
      if (!this.project) {
        const request = <CreateProjectDto>{ ...this.form.value };
        await firstValueFrom(this.projectService.create(request));
        successMsg = 'notification.create';
        errorMsg = 'error.create';
      } else {
        const request = <UpdateProjectDto>{ ...this.form.value };
        await firstValueFrom(
          this.projectService.update(this.project.id, request),
        );
        successMsg = 'notification.updated';
        errorMsg = 'error.update';
      }
      // success message
      this.snackBar.open(this.translateService.instant(successMsg), '', {
        duration: 5000,
      });
      this.dialog.close(true);
    } catch (err) {
      console.log('Unable to create/update project ', err);
      // error message
      this.snackBar.open(this.translateService.instant(errorMsg), '', {
        duration: 5000,
      });
    }
  }
}

@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    TranslateModule,
    MatInputModule,
  ],
})
export class ProjectModule {}
