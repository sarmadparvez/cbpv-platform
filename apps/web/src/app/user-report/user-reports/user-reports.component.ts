import { Component, NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserReport, UserReportsService } from '../../../gen/api/admin';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UserMap, UserService } from '../../user/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { NoDataModule } from '../../template/no-data/no-data.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import ReportActionEnum = UserReport.ReportActionEnum;
import ReportStatusEnum = UserReport.ReportStatusEnum;

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.scss'],
  providers: [UserService],
})
export class UserReportsComponent {
  dataSource: MatTableDataSource<UserReport> =
    new MatTableDataSource<UserReport>([]);
  displayedColumns: string[] = [
    'reporter',
    'reportedUser',
    'description',
    'dateCreated',
    'reportStatus',
    'reportAction',
    'feedback',
    'task',
    'options',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  userMap: UserMap = {};
  ReportAction = ReportActionEnum;
  ReportStatus = ReportStatusEnum;
  constructor(
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly translateService: TranslateService,
    private readonly snackBar: MatSnackBar,
    private readonly userReportService: UserReportsService,
    private readonly router: Router
  ) {
    this.findUserReports();
  }

  async findUserReports() {
    const userReports = await firstValueFrom(this.userReportService.findAll());
    if (Object.keys(this.userMap).length === 0) {
      this.getRelatedUsers(userReports);
    }
    this.dataSource = new MatTableDataSource(userReports);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getRelatedUsers(userReports: UserReport[]) {
    const ids = userReports
      .map((r) => r.reporterId)
      .concat(userReports.map((r) => r.reportedUserId));
    if (ids.length > 0) {
      this.userMap = await this.userService.getUserMap(ids);
    }
  }

  routeToFeedback(event: MouseEvent, feedbackId: string) {
    event.stopPropagation();
    this.router.navigate(['feedbacks', feedbackId]);
  }

  routeToTask(event: MouseEvent, projectId: string, taskId: string) {
    event.stopPropagation();
    this.router.navigate(['projects', projectId]);
  }

  async updateStatus(id: string, reportStatus: UserReport.ReportStatusEnum) {
    try {
      const userReport = await firstValueFrom(
        this.userReportService.update(id, {
          reportStatus: reportStatus,
        })
      );
      const oldUserReport = this.dataSource.data.find((u) => u.id === id);
      if (oldUserReport) {
        oldUserReport.reportStatus = userReport.reportStatus;
      }
      this.showSuccessMessage();
    } catch (err) {
      console.log('unable to update UserReport status ', err);
      this.showErrorMessage();
    }
  }

  async enableFeedback(id: string) {
    try {
      await firstValueFrom(this.userReportService.enableFeedback(id));
      this.findUserReports();
      this.showSuccessMessage();
    } catch (err) {
      console.log('unable to enable feedback', err);
      this.showErrorMessage();
    }
  }

  async disableFeedback(id: string) {
    try {
      await firstValueFrom(this.userReportService.disableFeedback(id));
      this.findUserReports();
      this.showSuccessMessage();
    } catch (err) {
      console.log('unable to enable feedback', err);
      this.showErrorMessage();
    }
  }

  showErrorMessage() {
    const message = this.translateService.instant('error.tryAgainLater');
    this.snackBar.open(message, '', {
      duration: 5000,
    });
  }

  showSuccessMessage() {
    const message = this.translateService.instant('notification.success');
    this.snackBar.open(message, '', {
      duration: 5000,
    });
  }
}
@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatMenuModule,
    TranslateModule,
    MatPaginatorModule,
    NoDataModule,
    MatIconModule,
    MatTooltipModule,
    MatSortModule,
    MatButtonModule,
  ],
  declarations: [UserReportsComponent],
})
export class UserReportsModule {}
