import { Component } from '@angular/core';
import { User } from '../../../gen/api/admin';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  RolesEnum = User.RolesEnum;
  constructor() {}
}
