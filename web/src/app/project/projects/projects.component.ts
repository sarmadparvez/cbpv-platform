import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  constructor() {}
}

@NgModule({
  declarations: [ProjectsComponent],
  imports: [CommonModule],
})
export class ProjectsModule {}
