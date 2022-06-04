import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      const matched = await bcrypt.compare(pass, user.passwordHash);
      if (matched) {
        delete user.passwordHash;
        return user;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      firstName: user.firstName,
      lastName: user.lastName,
      sub: user.id,
      roles: user.roles,
    };
    const response = new LoginResponseDto();
    response.accessToken = this.jwtService.sign(payload);
    return response;
  }

  async googleLogin(req: any, res: any) {
    if (!req.user) {
      throw new BadRequestException();
    }
    // check if user already exist in database
    const user = await this.usersService.findOneBy({
      where: {
        googleId: req.user.googleId,
      },
    });
    const webAppUrl = this.configService.get<string>('WEB_APP_URL');
    if (user) {
      // user is already registered
      const login = await this.login(user);
      res.redirect(
        `${webAppUrl}/access/login?accessToken=${login.accessToken}`
      );
      return;
    }
    // User does not exist in the database, it needs to proceed with completing registration
    res.redirect(
      `${webAppUrl}/access/register?googleId=${req.user.googleId}&firstName=${req.user.firstName}&lastName=${req.user.lastName}`
    );
  }
}
