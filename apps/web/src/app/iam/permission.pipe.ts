import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Action } from '../../gen/api/admin';
import ActionEnum = Action.ActionEnum;
import { map, Observable } from 'rxjs';
import { PermissionsService } from './permission.service';

@Pipe({ name: 'permission', pure: true })
export class PermissionPipe implements PipeTransform {
  constructor(private permService: PermissionsService) {}

  transform(action: ActionEnum, subject: string): Observable<boolean> {
    return this.permService.userAbility.pipe(
      map((ability) => {
        return ability.can(action, subject);
      })
    );
  }
}

@NgModule({
  declarations: [PermissionPipe],
  exports: [PermissionPipe],
})
export class PermissionPipeModule {}
