import { firstValueFrom, isEmpty, map, ReplaySubject } from 'rxjs';
import { Ability } from '@casl/ability';
import { unpackRules } from '@casl/ability/extra';
import { Injectable } from '@angular/core';
import { IAMService } from '../../gen/api/admin';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private permissionsFetched = false;
  userAbility: ReplaySubject<Ability> = new ReplaySubject<Ability>(1);

  constructor(
    private readonly iamService: IAMService,
    private readonly authService: AuthService,
  ) {
    this.authService.logoutObservable.subscribe(() => {
      this.permissionsFetched = false;
      this.userAbility = new ReplaySubject<Ability>(1);
    });
  }
  async fetchPermissions() {
    if (this.permissionsFetched) {
      return;
    }
    this.authService.loading.next(true);
    try {
      const response = (await firstValueFrom(
        this.iamService.getPermissions(),
      )) as any;
      const userAbility = new Ability();
      userAbility.update(unpackRules(response));
      this.userAbility.next(userAbility);
      this.permissionsFetched = true;
      this.authService.loading.next(false);
    } catch (err) {
      this.authService.loading.next(false);
      throw err;
    }
  }
}
