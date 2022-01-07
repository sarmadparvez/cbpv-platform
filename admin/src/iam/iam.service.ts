import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as contextService from 'request-context';
import { packRules } from '@casl/ability/extra';

@Injectable()
export class IamService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getPermissions() {
    const taskServicePermissions =
      await this.getUserPermissionsFromTaskService();

    return packRules(
      contextService.get('userAbility')?.rules,
      (subjectType: any) => {
        if (typeof subjectType === 'string') {
          return subjectType;
        }
        return subjectType.name;
      },
    ).concat(taskServicePermissions);
  }

  /**
   * Get a user from admin service
   * @param id the uuid for the user
   */
  async getUserPermissionsFromTaskService() {
    const taskApi = this.configService.get<string>('TASK_API');
    const getPermissionsUrl = this.configService.get<string>(
      'GET_PERMISSIONS_ENDPOINT',
    );
    if (!taskApi || !getPermissionsUrl) {
      throw new HttpException(
        {
          status: HttpStatus.SERVICE_UNAVAILABLE,
          error: 'Task service get permissions endpoint url not found.',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${taskApi}/${getPermissionsUrl}`, {
          headers: getAuthorizationHeader(),
        }),
      );
      return response.data;
    } catch (err) {
      Logger.error(`failed to permissions from Task service ${err}`);
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
