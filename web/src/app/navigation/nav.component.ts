import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PermissionsService } from '../iam/permission.service';
import { Action } from '../../../gen/api/admin';
import ActionEnum = Action.ActionEnum;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  isOpen = true;
  Action = ActionEnum;

  constructor(
    private authService: AuthService,
    private router: Router,
    private readonly permService: PermissionsService,
  ) {
    this.permService.fetchPermissions();
  }

  public toggleSideNav() {
    this.isOpen = !this.isOpen;
  }
}
