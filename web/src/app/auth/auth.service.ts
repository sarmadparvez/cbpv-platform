import { Injectable } from '@angular/core';
import { CrudService } from '../http/crud.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../storage/storage.service';
import { StorageKey } from '../storage/storage.model';
import {
  AuthService as AdminAuthService,
  LoginDto,
} from '../../../gen/api/admin';
import { firstValueFrom } from 'rxjs';
const { AUTH_TOKEN } = StorageKey;

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class AuthService extends CrudService {
  endpoint = 'auth';
  token: string;
  redirectUrl: string;

  constructor(
    http: HttpClient,
    private storage: StorageService,
    private readonly authService: AdminAuthService,
  ) {
    super(http);
    this.token = this.storage.read(AUTH_TOKEN) || '';
  }

  public async login(email: string, password: string) {
    try {
      this.token = await this.post({ email, password });
      this.storage.save(AUTH_TOKEN, this.token);
      return this.redirectUrl;
    } catch (error) {
      console.error('Error during login request', error);
      return Promise.reject(error);
    }
  }

  public async mockLogin(email: string, password: string) {
    try {
      if (!(email === 'user' && password === 'user')) {
        throw new Error(
          'When using mockLogin, login with credentials: \nemail: user\npassword:user',
        );
      }
      this.token = 'user';
      this.storage.save(StorageKey.AUTH_TOKEN, this.token);
      return this.redirectUrl;
    } catch (e) {
      return Promise.reject(e.message);
    }
  }

  public async loginWithUsernameAndPassword(
    username: string,
    password: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.authService.login(<LoginDto>{
          username,
          password,
        }),
      );
      console.log('login response ', response);
      this.token = 'user';
      this.storage.save(StorageKey.AUTH_TOKEN, this.token);
      return this.redirectUrl;
    } catch (e) {
      return Promise.reject(e.message);
    }
  }

  public getToken(): string {
    return this.token;
  }

  public logout() {
    this.token = '';
    this.storage.remove(AUTH_TOKEN);
  }

  public isLogged(): boolean {
    return this.token.length > 0;
  }
}
