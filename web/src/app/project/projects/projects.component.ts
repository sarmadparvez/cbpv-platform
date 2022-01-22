import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ProjectFormComponent } from '../project-form/project-form.component';
import { Project, ProjectsService } from '../../../../gen/api/task';
import { firstValueFrom } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogData,
} from '../../template/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {
  dataSource: MatTableDataSource<Project>;
  displayedColumns: string[] = [
    'title',
    'description',
    'dateCreated',
    'status',
    'options',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly dialog: MatDialog,
    private readonly projectService: ProjectsService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly translateService: TranslateService,
    private readonly route: ActivatedRoute,
  ) {
    this.searchProjects();
    Window['pself'] = this;
  }

  openProjectFormDialog(projectId?: string) {
    let project: Project;
    if (projectId) {
      project = this.dataSource.data.find(project => project.id === projectId);
    }
    this.dialog
      .open(ProjectFormComponent, {
        data: project,
        disableClose: true,
        width: '45vw',
      })
      .afterClosed()
      .subscribe((created: boolean) => {
        if (created) {
          this.searchProjects();
        }
      });
  }

  async searchProjects() {
    const projects = await firstValueFrom(this.projectService.searchAll());
    this.dataSource = new MatTableDataSource(projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  openProject(event: MouseEvent, project: string) {
    event.preventDefault();
    this.router.navigate([project], {
      relativeTo: this.route,
    });
  }

  async deleteProject(project: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: <ConfirmationDialogData>{
        title: this.translateService.instant('note.deleteProjectConfirmTitle'),
        message: this.translateService.instant(
          'note.deleteProjectConfirmMessage',
        ),
      },
      width: '50vw',
    });
    dialogRef.afterClosed().subscribe(async confirm => {
      if (confirm) {
        try {
          await firstValueFrom(this.projectService.remove(project));
          this.searchProjects();
        } catch (err) {
          console.log('Unable to delete project');
          this.snackBar.open(
            this.translateService.instant('error.delete'),
            '',
            {
              duration: 5000,
            },
          );
        }
      }
    });
  }
}

@NgModule({
  declarations: [ProjectsComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    NoDataModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class ProjectsModule {}

/**
 * Convert date object to ISO 8601 date string e.g 2022-01-01
 * @param date the date to be converted
 */
export function dateToDBDateString(date?: Date): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  if (date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}`;
  }
  return '';
}

/**
 * Convert date object to display format e.g 15-12.2021 18:20:49
 * @param date the date to be convert
 * @param time if set to true, the time will also be converted
 */
export function dateToDisplayString(date?: Date, time?: boolean): string {
  const pad = (num: number) => String(num).padStart(2, '0');
  if (date) {
    let dateStr = `${pad(date.getDate())}.${pad(
      date.getMonth() + 1,
    )}.${date.getFullYear()}`;
    if (time) {
      dateStr += ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
        date.getSeconds(),
      )}`;
    }
    return dateStr;
  }
  return '';
}
