import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../access/register/register.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CountriesService,
  SkillsService,
  UpdateUserDto,
  User,
  UsersService,
} from '../../../gen/api/admin';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
export class ProfileComponent extends RegisterComponent implements OnInit {
  user = new ReplaySubject<User>(1);

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly fb: FormBuilder,
    protected readonly translateService: TranslateService,
    protected readonly skillService: SkillsService,
    protected readonly countryService: CountriesService,
    protected readonly userService: UsersService,
    protected readonly snackBar: MatSnackBar,
    protected readonly router: Router,
    private readonly authService: AuthService,
  ) {
    super(
      route,
      fb,
      translateService,
      skillService,
      countryService,
      userService,
      snackBar,
      router,
    );
    this.initializeFormWithUserData();
  }

  async initializeFormWithUserData() {
    this.user = this.authService.getCurrentUser();
    const user = await firstValueFrom(this.user);

    user.skills.forEach(skill => this.selectedSkills.push(skill));
    this.form = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      username: [user.username, Validators.required],
      birthDate: [user.birthDate, Validators.required],
      gender: [user.gender, Validators.required],
      roles: [user.roles, Validators.required],
      country: [user.country, Validators.required],
      skills: ['', [() => this.skillsValid()]],
      experience: [user.experience, Validators.required],
    });
    this.form.controls.username.disable();
  }

  async save(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    // If user changed its roles, a re-login is required because JWT needs to be updated with new roles as it is
    // included in signature
    const rolesChanged = await this.rolesChanged();
    let message = this.translateService.instant('notification.update');
    const user = await firstValueFrom(this.user);
    const { country, skills, ...formData } = this.form.value;
    const request = <UpdateUserDto>{
      ...formData,
    };
    this.fillDataInRequest(request);
    try {
      const updateUser = await firstValueFrom(
        this.userService.update(user.id, request),
      );
      if (rolesChanged) {
        message = this.translateService.instant(
          'notification.rolesChangeReLogin',
        );
        this.authService.logout();
      } else {
        // update the user in cache.
        this.authService.setCurrentUser(updateUser);
      }
    } catch (err) {
      message = this.translateService.instant('error.update');
      console.log('unable to update user ', err);
    } finally {
      this.snackBar.open(message, '', { duration: 5000 });
    }
  }

  async rolesChanged() {
    const user = await firstValueFrom(this.user);
    const newRoles = this.form.controls.roles.value;
    return user.roles.sort().join('') !== newRoles.sort().join('');
  }
}
