import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxMaterialRatingModule } from 'ngx-material-rating';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';

export interface RatingDialogData {
  title: string;
  note: string;
  rating: number;
  ratingComment: string;
}
@Component({
  selector: 'app-rating-dialog',
  templateUrl: './rating-dialog.component.html',
  styleUrls: ['./rating-dialog.component.scss'],
})
export class RatingDialogComponent {
  title!: string;
  note!: string;
  rating!: number;
  form = this.fb.group({
    ratingComment: [''],
  });
  constructor(
    private readonly fb: FormBuilder,
    private dialogRef: MatDialogRef<RatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: RatingDialogData
  ) {
    if (this.data) {
      this.title = this.data?.title;
      this.note = this.data?.note;
      this.form.get('ratingComment')?.setValue(this.data.ratingComment);
      this.rating = this.data.rating;
    }
  }

  save() {
    if (!this.rating || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(<RatingDialogData>{
      rating: this.rating,
      ratingComment: this.form.get('ratingComment')?.value,
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgxMaterialRatingModule,
    FormsModule,
    TranslateModule,
    MatInputModule,
  ],
  declarations: [RatingDialogComponent],
})
export class RatingDialogModule {}
