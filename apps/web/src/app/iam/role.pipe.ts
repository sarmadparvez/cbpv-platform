import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from '../../gen/api/admin';
import RolesEnum = UpdateUserDto.RolesEnum;

@Pipe({ name: 'hasRoles', pure: true })
export class RolePipe implements PipeTransform {
  constructor(private authService: AuthService) {}

  transform(roles: RolesEnum[]): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      map((user) => {
        return roles.every((role) => user.roles.includes(role));
      })
    );
  }
}

@NgModule({
  declarations: [RolePipe],
  exports: [RolePipe],
})
export class RolePipeModule {}
