import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PermissionsService } from '../iam/permission.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuard implements CanActivate {
  constructor(
    private permService: PermissionsService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (route.data && route.data.permission && route.data.subject) {
      try {
        await this.permService.fetchPermissions();
        const ability = await firstValueFrom(this.permService.userAbility);
        if (!ability.can(route.data.permission, route.data.subject)) {
          this.router.navigate(['']);
          return false;
        }
      } catch (err) {
        console.log('err checking route permissions ', err);
        this.router.navigate(['']);
        return false;
      }
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class EvaluationRouteGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (route.data && route.data.permission && route.data.subject) {
      try {
        const user = await firstValueFrom(this.authService.getCurrentUser());
        if (user.feedbackDisabled) {
          this.router.navigate(['']);
          return false;
        }
      } catch (err) {
        console.log('err checking feedback permissions ', err);
        this.router.navigate(['']);
        return false;
      }
    }
    return true;
  }
}
