import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

/**
 *  The routes guarded by this guard cannot be access if the user is logged in.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  /**
   * If the use is logged in, redirect to home, otherwise allow the route
   */
  canActivate(): boolean {
    if (this.authService.isLogged()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
