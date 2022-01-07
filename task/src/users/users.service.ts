import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as contextService from 'request-context';

@Injectable()
export class UsersService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Get a user from admin service
   * @param id the uuid for the user
   */
  async getUser(id: string) {
    const adminAPI = this.configService.get<string>('ADMIN_API');
    const usersEndpoint = this.configService.get<string>('USERS_ENDPOINT');
    if (!adminAPI || !usersEndpoint) {
      throw new HttpException(
        {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Admin service users endpoint url not found.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get<User>(`${adminAPI}/${usersEndpoint}/${id}`, {
          headers: getAuthorizationHeader(),
        }),
      );
      return response.data;
    } catch (err) {
      Logger.error(`failed to fetch user details ${err}`);
      throw new HttpException(
        {
          error: err?.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}

export function getAuthorizationHeader() {
  return {
    Authorization: contextService.get('request').header('Authorization'),
  };
}
