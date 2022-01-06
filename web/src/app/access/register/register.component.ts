import { Component, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AccessContainerModule } from '../access-container/access-container.component';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  DateAdapter,
  ErrorStateMatcher,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { CreateWithSSODto } from '../../../../gen/api/admin';
import GenderEnum = CreateWithSSODto.GenderEnum;
import RolesEnum = CreateWithSSODto.RolesEnum;
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD.MM.YYYY',
        },
        display: {
          dateInput: 'DD.MM.YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
})
export class RegisterComponent implements OnInit {
  googleId: string;
  customMatcher = new CustomErrorStateMatcher();
  GenderEnum = GenderEnum;
  RolesEnum = RolesEnum;
  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    passwords: this.fb.group(
      {
        password: ['', Validators.required],
        repeatPassword: ['', Validators.required],
      },
      {
        validators: matchPassword,
      },
    ),
    birthDate: ['', Validators.required],
    gender: ['', Validators.required],
    roles: ['', Validators.required],
    country: ['', Validators.required],
    skills: ['', Validators.required],
  });
  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
  ) {
    Window['rcself'] = this;
  }

  ngOnInit(): void {
    this.googleId = this.route.snapshot.queryParamMap.get('googleId');

    console.log('googleId ', this.googleId);
    if (this.googleId) {
      this.registerForm.get('username').disable();
      this.registerForm.get('passwords').disable();
      const firstName = this.route.snapshot.queryParamMap.get('firstName');
      const lastName = this.route.snapshot.queryParamMap.get('lastName');
      this.registerForm.get('firstName').setValue(firstName);
      this.registerForm.get('lastName').setValue(lastName);
    }
  }

  register() {
    console.log('in register');
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const birthDateControl = this.registerForm.controls.birthDate.value;
    const birthDate = `${birthDateControl.year()}-${birthDateControl.month() +
      1}-${birthDateControl.date()}`;
    console.log('birthdate ', birthDate);
  }
}

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    FlexLayoutModule,
    AccessContainerModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    TranslateModule,
    MatDatepickerModule,
    MatSelectModule,
  ],
})
export class RegisterModule {}

// based on a solution from https://stackoverflow.com/questions/51605737/confirm-password-validation-in-angular-6/55929868
function matchPassword(group: AbstractControl): ValidationErrors | null {
  let pass = group.get('password').value;
  let confirmPass = group.get('repeatPassword').value;
  return pass === confirmPass ? null : { matchPassword: true };
}
export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const invalidCtrl = !!(control?.invalid && control?.parent?.dirty);
    const invalidParent = !!(
      control?.parent?.invalid && control?.parent?.dirty
    );
    return invalidCtrl || invalidParent;
  }
}
