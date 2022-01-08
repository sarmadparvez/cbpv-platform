import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateWithSSODto, User } from '../../../../gen/api/admin';
import { AuthService } from '../../auth/auth.service';
import { ReplaySubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import RolesEnum = CreateWithSSODto.RolesEnum;

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent {
  @Output() toggleSideNav = new EventEmitter();
  roleControl = new FormControl();
  user = new ReplaySubject<User>();
  RolesEnum = RolesEnum;

  constructor(private authService: AuthService, private router: Router) {
    this.getUser();
  }

  async getUser() {
    const user = await this.authService.getCurrentUser();
    this.user.next(user);
  }

  public onToggleSideNav() {
    this.toggleSideNav.emit();
  }

  public onLogout() {
    this.authService.logout();
    this.router.navigate(['login'], { replaceUrl: true });
  }
}

@NgModule({
  declarations: [NavToolbarComponent],
  exports: [NavToolbarComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    AvatarModule,
    MatMenuModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
})
export class NavToolbarModule {}
