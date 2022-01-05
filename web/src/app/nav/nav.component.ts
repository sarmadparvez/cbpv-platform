import { Component } from '@angular/core';
import { NavigationService, Page } from '../../nav/navigation.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  isOpen = true;

  constructor(
    private navigationService: NavigationService,
    private authService: AuthService,
    private router: Router,
  ) {}

  public toggleSideNav() {
    this.isOpen = !this.isOpen;
  }

  public getActivePage(): Page {
    return this.navigationService.getActivePage();
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['login'], { replaceUrl: true });
  }

  public getPreviousUrl(): string[] {
    return this.navigationService.getPreviousUrl();
  }
}
