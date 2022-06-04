import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import * as contextService from 'request-context';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Override to set request in the contextService to make it available throughout thea app.
   * @param context
   */
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    contextService.set('request', request);
    return super.canActivate(context);
  }
}
