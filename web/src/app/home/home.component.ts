import { Component } from '@angular/core';
import { User } from '../../../gen/api/admin';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  RolesEnum = User.RolesEnum;
  constructor() {}
}
