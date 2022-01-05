import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Page } from '../../../nav/navigation.service';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss'],
})
export class NavToolbarComponent {
  @Input() activePage: Page;
  @Input() previousUrl: string[];
  @Output() toggleSideNav = new EventEmitter();
  @Output() logout = new EventEmitter();

  constructor() {}

  public onToggleSideNav() {
    this.toggleSideNav.emit();
  }

  public onLogout() {
    this.logout.emit();
  }
}
