import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskFormComponent } from '../task-form/task-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent {
  iterationsControl = new FormControl('');
  projectId: string;
  constructor(
    private router: Router,
    private readonly dialog: MatDialog,
    private route: ActivatedRoute,
  ) {
    Window['pcself'] = this;
    this.projectId = this.route.snapshot.paramMap.get('projectId');
  }

  setCurrentIterations($event: MatSelectChange) {}

  openTaskForm() {
    this.dialog
      .open(TaskFormComponent, {
        disableClose: true,
        width: '70vw',
        data: {
          projectId: this.projectId,
        },
      })
      .afterClosed()
      .subscribe((created: boolean) => {
        if (created) {
        }
      });
  }

  routeToProjects() {
    this.router.navigate(['projects']);
  }
}

/**
 * Project module
 * */
@NgModule({
  declarations: [ProjectComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSidenavModule,
    FlexModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class ProjectModule {}
