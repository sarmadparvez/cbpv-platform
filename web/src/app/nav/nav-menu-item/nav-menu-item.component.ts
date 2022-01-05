import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../nav/navigation.service';

@Component({
  selector: 'app-nav-menu-item',
  templateUrl: './nav-menu-item.component.html',
  styleUrls: ['./nav-menu-item.component.scss'],
})
export class NavMenuItemComponent {
  active: boolean;
  @Input() text: string;
  @Input() icon: string;
  @Input()
  set selectionTriggerRoute(value: string) {
    this.active = this.currentRoute === value;
    if (this.active) {
      this.navigationService.setActivePage(this.text);
    }
  }
  private readonly currentRoute: string;
  constructor(
    private readonly route: ActivatedRoute,
    private navigationService: NavigationService,
  ) {
    this.currentRoute = route.snapshot.routeConfig?.path ?? '';
  }
}
