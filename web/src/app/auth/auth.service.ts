import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { StorageKey } from '../storage/storage.service';
import {
  AuthService as AdminAuthService,
  IAMService,
  LoginDto,
  User,
  UsersService,
} from '../../../gen/api/admin';
import { firstValueFrom, ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
const { AUTH_TOKEN } = StorageKey;
import jwt_decode from 'jwt-decode';
import { PermissionsService } from '../iam/permission.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  endpoint = 'auth';
  token: string;
  redirectUrl: string;
  user: ReplaySubject<User>;
  logoutObservable = new ReplaySubject<void>(1);
  loading = new ReplaySubject<boolean>(1);

  constructor(
    http: HttpClient,
    private storage: StorageService,
    private readonly authService: AdminAuthService,
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly iamService: IAMService,
    private readonly userService: UsersService,
  ) {
    this.token = this.storage.read(AUTH_TOKEN) || '';
  }

  public async loginWithUsernameAndPassword(
    username: string,
    password: string,
  ) {
    try {
      this.loading.next(true);
      const response = await firstValueFrom(
        this.authService.login(<LoginDto>{
          username,
          password,
        }),
      );
      this.loading.next(false);
      if (response.accessToken) {
        this.token = response.accessToken;
        this.storage.save(AUTH_TOKEN, this.token);
        return this.redirectUrl;
      }
      throw new Error(`unable to login`);
    } catch (e) {
      this.loading.next(false);
      console.error('Error during login request', e);
      return Promise.reject(e.message);
    }
  }

  async loginWithToken(token: string) {
    if (token) {
      try {
        this.token = token;
        await firstValueFrom(this.authService.loginWithToken());
        this.storage.save(AUTH_TOKEN, this.token);
        return this.redirectUrl;
      } catch (err) {
        console.log(err);
        this.snackBar.open(this.translateService.instant('error.login'), '', {
          duration: 5000,
        });
        // remove the accessToken from URL
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });
        throw new Error('Error logging in with token');
      }
    }
    throw new Error('Cannot login without a token');
  }

  getCurrentUser(forceFetch?: boolean) {
    if (!forceFetch && this.user) {
      // return from cache
      return this.user;
    }

    if (!this.user || forceFetch) {
      this.user = new ReplaySubject<User>(1);
    }
    const token: any = jwt_decode(this.getToken());
    if (token.sub) {
      firstValueFrom(this.userService.findOne(token.sub)).then(resp => {
        this.user.next(resp);
      });
      return this.user;
    }
    throw new Error('unable to get user');
  }

  setCurrentUser(user: User) {
    this.user.next(user);
  }

  public getToken(): string {
    return this.token;
  }

  public logout() {
    this.token = '';
    this.user = null;
    this.logoutObservable.next(null);
    this.storage.remove(AUTH_TOKEN);
    this.router.navigate(['login'], { replaceUrl: true });
  }

  public isLogged(): boolean {
    return this.token.length > 0;
  }
}
