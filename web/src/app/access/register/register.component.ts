import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
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
import {
  CountriesService,
  Country,
  CreateUserDto,
  CreateWithSSODto,
  Skill,
  SkillsService,
  UsersService,
} from '../../../../gen/api/admin';
import GenderEnum = CreateWithSSODto.GenderEnum;
import RolesEnum = CreateWithSSODto.RolesEnum;
import { MatSelectModule } from '@angular/material/select';
import { firstValueFrom, map, Observable, startWith } from 'rxjs';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import SsoProviderEnum = CreateWithSSODto.SsoProviderEnum;
import { parseError } from '../../error/parse-error';

export const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

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
  separatorKeysCodes: number[] = [ENTER, COMMA];
  ssoProfileId: string;
  customMatcher = new CustomErrorStateMatcher();
  GenderEnum = GenderEnum;
  RolesEnum = RolesEnum;
  countries: Country[] = [];
  allSkills: Skill[] = [];
  selectedSkills: Skill[] = [];
  filteredSkills: Observable<Skill[]>;
  filteredCountries: Observable<Country[]>;
  @ViewChild('skillsInput') skillsInput: ElementRef<HTMLInputElement>;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    passwords: this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.pattern(PASSWORD_REGEX)],
        ],
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
    skills: ['', [() => this.skillsValid()]],
    experience: [null, Validators.required],
  });
  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService,
    private readonly skillService: SkillsService,
    private readonly countryService: CountriesService,
    private readonly userService: UsersService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
  ) {
    Window['rcself'] = this;
  }

  async ngOnInit() {
    // fetch skills and countries
    await Promise.all([this.fetchCountries(), this.fetchSkills()]);
    this.filteredCountries = this.form.controls.country.valueChanges.pipe(
      startWith(''),
      map(value => this.filterCountries(value)),
    );
    this.filteredSkills = this.form.controls.skills.valueChanges.pipe(
      startWith(null),
      map((value: string | null) =>
        value ? this.filterSkills(value) : this.filterSkills(''),
      ),
    );

    this.ssoProfileId = this.route.snapshot.queryParamMap.get('googleId');

    if (this.ssoProfileId) {
      this.form.get('username').disable();
      this.form.get('passwords').disable();
      const firstName = this.route.snapshot.queryParamMap.get('firstName');
      const lastName = this.route.snapshot.queryParamMap.get('lastName');
      this.form.get('firstName').setValue(firstName);
      this.form.get('lastName').setValue(lastName);
    }
  }

  async fetchSkills() {
    try {
      this.allSkills = await firstValueFrom(this.skillService.findAll());
    } catch (err) {
      console.log('unable to fetch skills ', err);
    }
  }

  async fetchCountries() {
    try {
      this.countries = await firstValueFrom(this.countryService.findAll());
    } catch (err) {
      console.log('unable to fetch countries ', err);
    }
  }

  async register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.ssoProfileId) {
      this.registerWithSSO();
    } else {
      this.registerWithUsername();
    }
  }

  async registerWithUsername() {
    const { passwords, country, skills, ...formData } = this.form.value;
    let request = <CreateUserDto>{
      ...formData,
    };
    this.filLDataInRequest(request);
    request.password = this.form.get('passwords').get('password').value;
    try {
      await firstValueFrom(this.userService.create(request));
      this.handleRegistrationSuccess();
    } catch (err) {
      this.handleError(err);
    }
  }

  async registerWithSSO() {
    const request = <CreateWithSSODto>{
      ssoProfileId: this.ssoProfileId,
      ...this.form.value,
    };
    this.filLDataInRequest(request);
    request.ssoProvider = SsoProviderEnum.Google;
    try {
      await firstValueFrom(this.userService.createWithSSO(request));
      this.handleRegistrationSuccess();
    } catch (err) {
      this.handleError(err);
    }
  }

  private filLDataInRequest(request: CreateUserDto | CreateWithSSODto) {
    request.birthDate = dateToDBDateString(
      new Date(this.form.controls.birthDate.value),
    );
    request.country = this.form.controls.country.value.id;
    request.skills = this.selectedSkills.map(skill => skill.id);
  }

  private handleRegistrationSuccess() {
    const message = this.translateService.instant(
      'notification.registerSuccess',
    );
    this.snackBar.open(message, '', {
      duration: 5000,
    });
    this.router.navigate(['/']);
  }

  private handleError(err) {
    console.log('Unable to register ', err);
    const error = parseError(err);
    if (error?.message) {
      this.snackBar.open(error.message, '', {
        duration: 5000,
      });
    }
  }

  private filterCountries(value: string): Country[] {
    if (typeof value !== 'string') {
      return;
    }
    const filterValue = value.toLowerCase();

    return this.countries.filter(option =>
      option.name.toLowerCase().includes(filterValue),
    );
  }

  private filterSkills(value: string): Skill[] {
    if (typeof value !== 'string') {
      return;
    }
    const filterValue = value.toLowerCase();
    const skillSelected = (skill: Skill) => {
      return this.selectedSkills.includes(skill);
    };
    return this.allSkills
      .filter(skill => !skillSelected(skill))
      .filter(option => option.name.toLowerCase().includes(filterValue));
  }

  displayFn(option: Country | Skill): string {
    return option && option.name ? option.name : '';
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.selectedSkills.push(event.option.value);
    this.skillsInput.nativeElement.value = '';
    this.skillsControl.setValue(null);
    this.skillsControl.updateValueAndValidity();
  }

  get skillsControl() {
    return this.form.controls.skills;
  }

  addSkill(event: MatChipInputEvent): void {
    event.chipInput!.clear();
    this.skillsControl.setValue(null);
    this.skillsControl.updateValueAndValidity();
  }

  remove(skill: Skill): void {
    const index = this.selectedSkills.indexOf(skill);

    if (index >= 0) {
      this.selectedSkills.splice(index, 1);
    }

    this.skillsControl.updateValueAndValidity();
  }

  skillsValid(): ValidationErrors | null {
    if (this.selectedSkills.length === 0) {
      return {
        required: true,
      };
    }
    return null;
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
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatSnackBarModule,
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

/**
 * Convert date object to ISO 8601 date string e.g 2022-01-01
 * @param date the date to be converted
 */
export function dateToDBDateString(date?: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  if (date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}`;
  }
  return '';
}
