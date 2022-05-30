import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AccessContainerModule } from '../access-container/access-container.component';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  username!: string;
  password!: string;
  errorMessage!: string;

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly translateService: TranslateService
  ) {}

  async ngOnInit() {
    this.errorMessage = '';
    const accessToken = this.route.snapshot.queryParamMap.get('accessToken');
    if (accessToken) {
      const url = await this.authService.loginWithToken(accessToken);
      this.navigateTo(url);
    }
  }

  googleSSORedirect(): void {
    window.location.href = `${environment.googleSSORedirect}/auth/google`;
  }

  public async login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      const url = await this.authService.loginWithUsernameAndPassword(
        this.form.controls.username.value,
        this.form.controls.password.value
      );
      this.navigateTo(url);
    } catch (e) {
      this.errorMessage = this.translateService.instant('error.login');
      console.error('Unable to Login!\n', e);
    }
  }

  public navigateTo(url?: string | null) {
    url = url || 'home';
    this.router.navigate([url], { replaceUrl: true });
  }
}

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    AccessContainerModule,
    MatIconModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
  ],
})
export class LoginModule {}
