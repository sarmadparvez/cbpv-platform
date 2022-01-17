import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  set selectionRoute(value: string) {
    this.active = this.currentRoute === value;
  }
  private readonly currentRoute: string;
  constructor(private readonly route: ActivatedRoute) {
    this.currentRoute = route.snapshot.routeConfig?.path ?? '';
  }
}
