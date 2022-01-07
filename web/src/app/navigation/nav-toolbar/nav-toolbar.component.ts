import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { AvatarModule } from 'ngx-avatars';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { User } from '../../../../gen/api/admin';
import { AuthService } from '../../auth/auth.service';
import { Observable, ReplaySubject } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent {
  @Output() toggleSideNav = new EventEmitter();
  @Output() logout = new EventEmitter();
  roleControl = new FormControl();
  user = new ReplaySubject<User>();

  constructor(private authService: AuthService) {
    this.setUser();
  }

  async setUser() {
    const user = await this.authService.getCurrentUser();
    this.user.next(user);
    this.setRole(user.roles[0]);
  }

  public onToggleSideNav() {
    this.toggleSideNav.emit();
  }

  public onLogout() {
    this.logout.emit();
  }

  setRole(value: any) {}
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
