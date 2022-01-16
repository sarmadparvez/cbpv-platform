import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
  Router,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { PermissionsService } from '../iam/permission.service';

@Injectable({
  providedIn: 'root',
})
export class RouteGuard implements CanActivate {
  constructor(
    private permService: PermissionsService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    if (route.data && route.data.permission && route.data.subject) {
      this.permService.fetchPermissions();
      const ability = await firstValueFrom(this.permService.userAbility);
      if (!ability.can(route.data.permission, route.data.subject)) {
        this.router.navigate(['']);
        return false;
      }
    }
    return true;
  }
}
