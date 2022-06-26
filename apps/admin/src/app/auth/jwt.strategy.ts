import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import * as contextService from 'request-context';
import { defineAbilityFor } from '../iam/policy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = {
      id: payload.sub,
      firstName: payload.firstName,
      lastName: payload.lastName,
      roles: payload.roles,
    };
    contextService.set('user', user);
    contextService.set(
      'userAbility',
      defineAbilityFor(contextService.get('user'))
    );
    return user;
  }
}
