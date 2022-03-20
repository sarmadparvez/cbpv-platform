import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {BatchGetUserInfoDto, User, UsersService} from "../../gen/api/admin";

export type UserMap = {
  [key: string]: User;
};
@Injectable()
export class UserService {
  constructor(private readonly userService: UsersService) {}

  async batchGetInfo(ids: string[]) {
    if (!ids || ids.length < 1) {
      throw new Error('no user id provided');
    }
    const request: BatchGetUserInfoDto = {
      ids,
    };
    return firstValueFrom(this.userService.batchGetInfo(request));
  }

  async getUserMap(ids: string[]) {
    if (!ids || ids.length < 1) {
      throw new Error('no user id provided');
    }
    const users = await this.batchGetInfo(ids);
    const userMap: UserMap = {};
    users.forEach(user => (userMap[user.id] = user));
    return userMap;
  }
}
