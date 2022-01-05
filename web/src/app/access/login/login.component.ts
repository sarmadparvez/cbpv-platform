import { Component, NgModule, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './login.guard';
import { CommonModule } from '@angular/common';
import { LogoModule } from '../../logo/logo.module';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { AccessContainerModule } from '../access-container/access-container.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  errorMessage: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.errorMessage = '';
  }

  public async login(email: string, password: string) {
    try {
      const url = (await this.authService.mockLogin(email, password)) as string;
      this.navigateTo(url);
    } catch (e) {
      this.errorMessage = 'Wrong Credentials!';
      console.error('Unable to Login!\n', e);
    }
  }

  public navigateTo(url?: string) {
    url = url || 'home';
    this.router.navigate([url], { replaceUrl: true });
  }
}

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    LogoModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    FormsModule,
    AccessContainerModule,
  ],
})
export class LoginModule {}
